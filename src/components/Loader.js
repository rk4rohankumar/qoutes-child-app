import { motion, useReducedMotion } from "framer-motion";

const Loader = () => {
  const reduce = useReducedMotion();
  return (
    <div
      className="flex flex-col items-center justify-center py-20"
      role="status"
      aria-live="polite"
    >
      <motion.div
        className="w-14 h-14 border-4 border-t-amber-500 border-slate-200 rounded-full"
        initial={{ opacity: 0 }}
        animate={reduce ? { opacity: 1 } : { opacity: 1, rotate: 360 }}
        transition={
          reduce
            ? { duration: 0.2 }
            : { duration: 1, repeat: Infinity, ease: "linear" }
        }
      />
      <p className="text-base font-medium text-slate-600 mt-4">
        Loading quote...
      </p>
    </div>
  );
};

export default Loader;
