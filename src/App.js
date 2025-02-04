import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import 'tailwindcss/tailwind.css';

const Loader = () => (
  <div className="flex flex-col items-center justify-center h-screen">
    <motion.div
      className="w-16 h-16 border-4 border-t-yellow-500 border-gray-300 rounded-full animate-spin"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, repeat: Infinity }}
    />
    <p className="text-lg font-semibold text-gray-700 mt-4">Loading Quote...</p>
  </div>
);

const QuotesPage = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("inspire");

  useEffect(() => {
    fetchQuote();
  }, [category]);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://quotes.rest/qod?category=${category}`);
      setQuote(response.data.contents.quotes[0]);
    } catch (error) {
      console.error("Failed to fetch quote:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">✨ Quote of the Day ✨</h1>

      {/* Category Selection */}
      <select
        className="p-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="inspire">Inspiration</option>
        <option value="love">Love</option>
        <option value="life">Life</option>
        <option value="funny">Funny</option>
      </select>

      {/* Quote Card */}
      <motion.div
        className="bg-white shadow-lg p-6 rounded-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-lg font-semibold text-gray-800">"{quote?.quote}"</p>
        <p className="text-sm text-gray-500 mt-2">- {quote?.author}</p>
      </motion.div>

      {/* Generate Button */}
      <button
        className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
        onClick={fetchQuote}
      >
        Get New Quote
      </button>
    </div>
  );
};

export default QuotesPage;
