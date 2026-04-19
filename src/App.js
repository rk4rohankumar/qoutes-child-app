import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";

import Loader from "./components/Loader";
import ErrorState from "./components/ErrorState";
import CategorySelect from "./components/CategorySelect";
import QuoteCard from "./components/QuoteCard";
import FavoritesList from "./components/FavoritesList";
import useFavorites from "./hooks/useFavorites";

const CATEGORY_KEYWORDS = {
  inspire: /\b(inspire|inspiration|dream|believe|succeed|success|possible|achieve|greatness|hope)\b/i,
  love: /\b(love|heart|kind|compassion|affection|soul)\b/i,
  life: /\b(life|live|living|world|journey|exist)\b/i,
  funny: /\b(laugh|funny|humor|joke|witty|silly|absurd)\b/i,
  wisdom: /\b(wisdom|wise|truth|virtue|knowledge|learn|understand)\b/i,
};

const buildId = (text, author) =>
  `${(author || "unknown").toLowerCase().replace(/\s+/g, "-")}::${(text || "")
    .slice(0, 64)
    .toLowerCase()
    .replace(/\s+/g, "-")}`;

const fetchFromStoic = async (category) => {
  const res = await axios.get("https://stoic-quotes.com/api/quote", {
    timeout: 8000,
  });
  const q = res?.data;
  if (!q || !q.text) throw new Error("Empty response from stoic-quotes");
  return {
    id: buildId(q.text, q.author),
    text: q.text,
    author: q.author,
    category,
    source: "stoic-quotes.com",
  };
};

const fetchFromDummyJson = async (category) => {
  const pattern = CATEGORY_KEYWORDS[category];
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const res = await axios.get("https://dummyjson.com/quotes/random", {
      timeout: 8000,
    });
    const q = res?.data;
    if (!q || !q.quote) continue;
    if (!pattern || pattern.test(q.quote) || pattern.test(q.author || "")) {
      return {
        id: q.id ? `dj-${q.id}` : buildId(q.quote, q.author),
        text: q.quote,
        author: q.author,
        category,
        source: "dummyjson.com",
      };
    }
  }
  const res = await axios.get("https://dummyjson.com/quotes/random", {
    timeout: 8000,
  });
  const q = res?.data;
  if (!q || !q.quote) throw new Error("Empty response from dummyjson");
  return {
    id: q.id ? `dj-${q.id}` : buildId(q.quote, q.author),
    text: q.quote,
    author: q.author,
    category,
    source: "dummyjson.com",
  };
};

const fetchQuoteWithFallback = async (category) => {
  if (category === "wisdom") {
    try {
      return await fetchFromStoic(category);
    } catch {
      return await fetchFromDummyJson(category);
    }
  }
  try {
    return await fetchFromDummyJson(category);
  } catch {
    return await fetchFromStoic(category);
  }
};

const QuotesPage = () => {
  const [category, setCategory] = useState("inspire");
  const [quote, setQuote] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);

  const copyTimer = useRef(null);
  const toastTimer = useRef(null);

  const { favorites, isFavorite, toggleFavorite, removeFavorite } =
    useFavorites();

  const loadNew = useCallback(
    async (cat) => {
      setLoading(true);
      setError(null);
      try {
        const next = await fetchQuoteWithFallback(cat);
        setQuote(next);
        setHistory((prev) => {
          const trimmed = [next, ...prev].slice(0, 10);
          return trimmed;
        });
        setHistoryIndex(0);
      } catch (err) {
        setError(
          "Both quote providers failed. Check your connection and try again."
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadNew(category);
  }, [category, loadNew]);

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    []
  );

  const showToast = (msg) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 1800);
  };

  const handleCopy = async () => {
    if (!quote) return;
    const payload = `"${quote.text}" — ${quote.author || "Unknown Author"}`;
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      showToast("Copy failed");
    }
  };

  const handleShare = async () => {
    if (!quote) return;
    const text = `"${quote.text}" — ${quote.author || "Unknown Author"}`;
    const shareData = {
      title: "Quote of the Day",
      text,
      url: typeof window !== "undefined" ? window.location.href : undefined,
    };
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        /* user cancelled or share failed — fall through to clipboard */
      }
    }
    try {
      const url = shareData.url || "";
      await navigator.clipboard.writeText(`${text}${url ? ` ${url}` : ""}`);
      showToast("Link copied to clipboard");
    } catch {
      showToast("Share unavailable");
    }
  };

  const handleToggleFavorite = () => {
    if (!quote) return;
    toggleFavorite(quote);
  };

  const handlePrev = () => {
    if (historyIndex < history.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      setQuote(history[nextIdx]);
    }
  };

  const handleNext = () => {
    if (historyIndex > 0) {
      const nextIdx = historyIndex - 1;
      setHistoryIndex(nextIdx);
      setQuote(history[nextIdx]);
    } else {
      loadNew(category);
    }
  };

  const canPrev = historyIndex < history.length - 1;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-amber-600">
            Daily Inspiration
          </p>
          <h1 className="mt-2 font-serif text-4xl sm:text-5xl font-bold text-slate-900">
            Quote of the Day
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            A fresh line of wisdom, every time you ask.
          </p>
        </header>

        <div className="mb-6 flex flex-col items-stretch gap-4 sm:flex-row sm:items-end sm:justify-between">
          <CategorySelect
            value={category}
            onChange={setCategory}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowFavorites((v) => !v)}
            aria-label={
              showFavorites ? "Hide favorites list" : "Show favorites list"
            }
            aria-pressed={showFavorites}
            className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-400 sm:self-auto"
          >
            {showFavorites ? "Hide favorites" : `Show favorites (${favorites.length})`}
          </button>
        </div>

        {loading && <Loader />}

        {!loading && error && (
          <ErrorState message={error} onRetry={() => loadNew(category)} />
        )}

        {!loading && !error && quote && (
          <QuoteCard
            quote={quote}
            isFavorite={isFavorite(quote.id)}
            onToggleFavorite={handleToggleFavorite}
            onCopy={handleCopy}
            onShare={handleShare}
            onPrev={handlePrev}
            onNext={handleNext}
            canPrev={canPrev}
            copied={copied}
            toast={toast}
          />
        )}

        {showFavorites && (
          <div className="mt-10">
            <h2 className="mb-4 text-center font-serif text-2xl font-semibold text-slate-900">
              Your favorites
            </h2>
            <FavoritesList favorites={favorites} onRemove={removeFavorite} />
          </div>
        )}
      </div>
    </main>
  );
};

export default QuotesPage;
