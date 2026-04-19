const ErrorState = ({ message, onRetry }) => (
  <div
    className="mx-auto max-w-2xl rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center"
    role="alert"
  >
    <h2 className="text-xl font-semibold text-rose-800">
      Couldn&apos;t load a quote
    </h2>
    <p className="mt-2 text-sm text-rose-700">
      {message || "Both providers are unavailable. Please try again."}
    </p>
    <button
      type="button"
      onClick={onRetry}
      aria-label="Retry fetching quote"
      className="mt-5 inline-flex items-center justify-center rounded-full bg-rose-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
    >
      Retry
    </button>
  </div>
);

export default ErrorState;
