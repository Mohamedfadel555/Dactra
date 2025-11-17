import { Link } from "react-router-dom";

export default function AuthLink({ to, text, linkText, className = "" }) {
  return (
    <Link
      to={to}
      className={`font-[300] text-[12px] text-[#003465] font-english ${className}`}
    >
      {text} <span className="font-[500] text-[#3E69FE]">{linkText}</span>
    </Link>
  );
}
