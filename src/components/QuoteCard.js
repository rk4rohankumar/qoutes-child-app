import { motion, useReducedMotion } from "framer-motion";

const IconHeart = ({ filled }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const IconCopy = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const IconShare = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const IconPrev = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconNext = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const QuoteCard = ({
  quote,
  isFavorite,
  onToggleFavorite,
  onCopy,
  onShare,
  onPrev,
  onNext,
  canPrev,
  copied,
  toast,
}) => {
  const reduce = useReducedMotion();
  const text = quote?.text || "";
  const author = quote?.author && quote.author.trim() ? quote.author : "Unknown Author";

  return (
    <motion.section
      aria-live="polite"
      aria-label="Quote of the day"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.4, ease: "easeOut" }}
      className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-rose-50 to-indigo-100 p-8 sm:p-12 shadow-xl ring-1 ring-black/5"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-6 left-4 select-none font-serif text-[10rem] leading-none text-amber-300/60"
      >
        &ldquo;
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-20 right-4 select-none font-serif text-[10rem] leading-none text-indigo-300/50"
      >
        &rdquo;
      </span>

      <div className="relative">
        <blockquote className="font-serif text-2xl sm:text-3xl md:text-4xl leading-snug text-slate-800">
          {text}
        </blockquote>
        <figcaption className="mt-6 text-sm sm:text-base font-medium uppercase tracking-[0.2em] text-slate-600">
          &mdash; {author}
        </figcaption>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={!canPrev}
            aria-label="Previous quote from history"
            className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <IconPrev />
            Prev
          </button>
          <button
            type="button"
            onClick={onNext}
            aria-label="Get a new quote"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            New quote
            <IconNext />
          </button>
          <button
            type="button"
            onClick={onCopy}
            aria-label="Copy quote to clipboard"
            aria-pressed={copied}
            className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <IconCopy />
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            type="button"
            onClick={onShare}
            aria-label="Share quote"
            className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            <IconShare />
            Share
          </button>
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
            aria-pressed={isFavorite}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm ring-1 focus:outline-none focus:ring-2 focus:ring-amber-400 ${
              isFavorite
                ? "bg-rose-500 text-white ring-rose-500 hover:bg-rose-600"
                : "bg-white/70 text-slate-700 ring-slate-200 hover:bg-white"
            }`}
          >
            <IconHeart filled={isFavorite} />
            {isFavorite ? "Saved" : "Save"}
          </button>
        </div>

        {toast && (
          <div
            role="status"
            aria-live="polite"
            className="mt-4 inline-block rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white"
          >
            {toast}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default QuoteCard;
