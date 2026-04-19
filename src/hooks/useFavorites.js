import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "quote-favorites";

const readStorage = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const useFavorites = () => {
  const [favorites, setFavorites] = useState(readStorage);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      /* noop */
    }
  }, [favorites]);

  const isFavorite = useCallback(
    (id) => favorites.some((f) => f.id === id),
    [favorites]
  );

  const addFavorite = useCallback((quote) => {
    if (!quote || !quote.id) return;
    setFavorites((prev) => {
      if (prev.some((f) => f.id === quote.id)) return prev;
      return [
        {
          id: quote.id,
          text: quote.text,
          author: quote.author || "Unknown Author",
          category: quote.category,
          savedAt: new Date().toISOString(),
        },
        ...prev,
      ];
    });
  }, []);

  const removeFavorite = useCallback((id) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const toggleFavorite = useCallback(
    (quote) => {
      if (!quote || !quote.id) return;
      if (favorites.some((f) => f.id === quote.id)) {
        removeFavorite(quote.id);
      } else {
        addFavorite(quote);
      }
    },
    [favorites, addFavorite, removeFavorite]
  );

  return { favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite };
};

export default useFavorites;
