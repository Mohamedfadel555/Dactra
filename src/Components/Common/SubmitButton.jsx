import React from "react";
import { motion } from "framer-motion";
import "ldrs/ring2";

export default function SubmitButton({
  text = "Submit",
  loadingText = "Loading...",
  isLoading = false,
  disabled = false,
  className = "",
  fullWidth = true,
}) {
  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      type="submit"
      disabled={isDisabled}
      aria-busy={isLoading}
      aria-disabled={isDisabled}
      className={`relative flex items-center justify-center gap-3 text-white cursor-pointer font-semibold font-english px-4 py-2 ${
        fullWidth ? "w-full" : "inline-flex"
      } h-[44px] rounded-lg disabled:opacity-60 disabled:cursor-not-allowed transition-all ${className}`}
      style={{
        background: "linear-gradient(90deg,#3E69FE 0%, #2F5CEC 100%)",
      }}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      {isLoading && (
        <l-ring-2
          size="22"
          stroke="3"
          speed="1.4"
          color="#ffffff"
          aria-hidden="true"
        ></l-ring-2>
      )}

      <span>{isLoading ? loadingText : text}</span>
    </motion.button>
  );
}
