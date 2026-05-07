import { motion } from "framer-motion";
import { RiMessage3Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import dactraImg from "../../../public/dactraIcon.webp";

const pulseStyle = {
  position: "absolute",
  inset: 0,
  borderRadius: "9999px",
  background: "#2563eb",
  pointerEvents: "none",
  animation: "dactra-pulse 1.8s ease-out infinite",
};

const pulse2Style = {
  ...pulseStyle,
  animationDelay: "0.35s",
};

const keyframes = `
  @keyframes dactra-pulse {
    0%   { transform: scale(1);    opacity: 0.4; }
    100% { transform: scale(1.85); opacity: 0;   }
  }
`;

export default function DactraFloatButton({ to = "/chat" }) {
  const navigate = useNavigate();

  return (
    <>
      <style>{keyframes}</style>

      {/* Wrapper: handles fixed position & is the pulse anchor */}
      <div
        className=" right-[10px] md:right-[24px]"
        style={{
          position: "fixed",
          bottom: 24,

          zIndex: 50,
          display: "inline-flex",
        }}
      >
        {/* Pulse rings — pure CSS, always reliable */}
        <span style={pulseStyle} />
        <span style={pulse2Style} />

        {/* Button — Framer Motion for enter, hover, tap */}
        <motion.button
          onClick={() => navigate("/Dactra/chat")}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 20,
            delay: 0.4,
          }}
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.93 }}
          style={{
            position: "relative",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "9999px",
            padding: "14px 20px 14px 14px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            letterSpacing: "0.01em",
            whiteSpace: "nowrap",
          }}
          aria-label="Chat with Dactra"
        >
          {/* Icon bubble */}
          <div className="size-7 rounded-md bg-white flex justify-center items-center">
            <img src={dactraImg} alt="dactra" className="w-4/5" />
          </div>
          <span>
            Chat with <span className="font-bold">Dactra</span>
          </span>
        </motion.button>
      </div>
    </>
  );
}
