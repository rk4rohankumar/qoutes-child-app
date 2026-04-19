const FavoritesList = ({ favorites, onRemove }) => {
  if (!favorites.length) {
    return (
      <div className="mx-auto max-w-3xl rounded-2xl border border-dashed border-slate-300 bg-white/60 p-8 text-center">
        <p className="text-sm text-slate-600">
          No favorites yet. Tap the heart on a quote to save it.
        </p>
      </div>
    );
  }

  return (
    <ul className="mx-auto grid max-w-3xl gap-3" aria-label="Saved favorites">
      {favorites.map((fav) => (
        <li
          key={fav.id}
          className="flex items-start justify-between gap-4 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
        >
          <div className="min-w-0">
            <p className="font-serif text-lg leading-snug text-slate-800">
              {fav.text}
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              &mdash; {fav.author || "Unknown Author"}
              {fav.category ? ` - ${fav.category}` : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRemove(fav.id)}
            aria-label={`Remove favorite quote by ${fav.author || "Unknown Author"}`}
            className="shrink-0 rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-200 hover:bg-rose-100 focus:outline-none focus:ring-2 focus:ring-rose-400"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
};

export default FavoritesList;
