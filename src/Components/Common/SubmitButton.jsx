export default function SubmitButton({
  text = "Submit",
  loadingText = "Loading...",
  isLoading = false,
  disabled = false,
  className = "",
  fullWidth = true,
}) {
  return (
    <button
      type="submit"
      disabled={disabled || isLoading}
      className={`text-[#FFFFFF] text-[18px] cursor-pointer font-[600] font-english bg-[#3E69FE] ${
        fullWidth ? "w-full" : ""
      } h-[40px] rounded-[5px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#2d54d4] transition-all duration-300 ${className}`}
    >
      {isLoading ? loadingText : text}
    </button>
  );
}

