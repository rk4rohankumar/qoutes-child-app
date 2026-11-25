const CATEGORIES = [
  { value: "inspire", label: "Inspiration" },
  { value: "love", label: "Love" },
  { value: "life", label: "Life" },
  { value: "funny", label: "Funny" },
  { value: "wisdom", label: "Wisdom" },
];

const CategorySelect = ({ value, onChange, disabled }) => (
  <div className="flex flex-col items-start sm:items-center gap-1">
    <label
      htmlFor="quote-category"
      className="text-xs font-semibold uppercase tracking-wider text-[color:var(--mfe-muted,#475569)]"
    >
      Category
    </label>
    <select
      id="quote-category"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-full border border-[color:var(--mfe-border,#e2e8f0)] bg-[var(--mfe-surface,#ffffff)] px-4 py-2 text-sm font-medium text-[color:var(--mfe-ink,#0f172a)] shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-400 disabled:opacity-60"
    >
      {CATEGORIES.map((c) => (
        <option key={c.value} value={c.value}>
          {c.label}
        </option>
      ))}
    </select>
  </div>
);

export { CATEGORIES };
export default CategorySelect;
