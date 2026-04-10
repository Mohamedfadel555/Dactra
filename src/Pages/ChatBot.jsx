// DactraChat.jsx
// Dependencies: framer-motion, react-icons, tailwindcss
// Install:  npm install framer-motion react-icons
// Usage: <DactraChat apiKey="YOUR_KEY" />
//
// To connect your API, replace the `callAI` function below with your own.

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiChatAiLine } from "react-icons/ri";
import {
  HiOutlineDocumentText,
  HiOutlineMagnifyingGlass,
  HiPlus,
  HiOutlineMicrophone,
  HiChevronUp,
  HiXMark,
  HiBars3,
} from "react-icons/hi2";
import { LuClock, LuCircleHelp, LuSendHorizontal } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { GoPaperclip } from "react-icons/go";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { TbHeartRateMonitor } from "react-icons/tb";
import { FaRegQuestionCircle } from "react-icons/fa";
import BrandLogo from "./../Components/Common/BrandLogo";
import AvatarIcon from "./../Components/Common/AvatarIcon1";
import Icon from "../assets/images/icons/dactraIcon.webp";

// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────
// Edit this to match your exact Dactra platform details

const SYSTEM_PROMPT = `You are Dactra's medical assistant — a friendly, trustworthy AI embedded in the Dactra platform.

About Dactra:
- Dactra is a medical information platform that provides accurate, up-to-date health and medical content.
- Users can browse medical articles, learn about symptoms, diseases, medications, treatments, and general health topics.
- Dactra does NOT offer doctor consultations, appointments, prescriptions, or emergency services.

Your role:
- Answer medical information questions clearly and in simple language.
- Help users understand symptoms, conditions, medications, and treatments based on general medical knowledge.
- Answer questions about what Dactra offers and how to use the platform.
- Always remind users that Dactra's content is for informational purposes only and does not replace a real doctor's advice.

Rules — strictly follow these:
1. Only answer questions about: medical information, health topics, or the Dactra platform.
2. If asked about anything unrelated (politics, entertainment, coding, etc.), politely say: "I'm here only to help with medical information and questions about Dactra."
3. Never diagnose a specific person or prescribe medication.
4. If someone describes an emergency (chest pain, difficulty breathing, etc.), immediately say: "This sounds urgent — please call emergency services or go to the nearest hospital right away."
5. Always end medical answers with a brief disclaimer: "This is general information — please consult a doctor for personal medical advice."
6. Respond in the same language the user writes in (Arabic or English).`;

// ─── API CALL — replace this with your actual AI API ─────────────────────────

async function callAI(messages) {
  // Example using OpenAI-compatible API:
  // const res = await fetch("https://api.openai.com/v1/chat/completions", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json", Authorization: `Bearer ${YOUR_API_KEY}` },
  //   body: JSON.stringify({ model: "gpt-4o-mini", messages }),
  // });
  // const data = await res.json();
  // return data.choices[0].message.content;

  // ── DEMO fallback (remove when you connect real API) ──
  await new Promise((r) => setTimeout(r, 1200 + Math.random() * 600));
  const last = messages[messages.length - 1].content.toLowerCase();
  if (
    last.includes("dactra") ||
    last.includes("platform") ||
    last.includes("website")
  )
    return "Dactra is a medical information platform where you can explore thousands of health articles covering symptoms, diseases, medications, and treatments — all written and reviewed by medical professionals. It's designed to help you understand your health better. Remember, Dactra's content is for informational purposes only and doesn't replace a doctor's advice.";
  if (
    last.includes("emergency") ||
    last.includes("chest pain") ||
    last.includes("can't breathe")
  )
    return "⚠️ This sounds urgent — please call emergency services or go to the nearest hospital right away. Do not wait.";
  return "Based on the available medical information, this is a topic covered in detail on Dactra. I recommend reviewing trusted medical articles for a thorough understanding. As always, this is general information — please consult a doctor for personal medical advice.";
}

// ─── DATA ────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "chat", icon: RiChatAiLine, label: "AI Assistant", badge: null },
  { id: "topics", icon: MdOutlineHealthAndSafety, label: "Health Topics" },
  { id: "symptoms", icon: TbHeartRateMonitor, label: "Symptom Guide" },
  { id: "articles", icon: HiOutlineDocumentText, label: "Articles" },
  { id: "history", icon: LuClock, label: "History" },
];

const RECENT_CHATS = [
  { text: "What causes high blood pressure?", time: "Just now" },
  { text: "Symptoms of vitamin D deficiency", time: "Today, 08:57 PM" },
  { text: "Is ibuprofen safe long-term?", time: "Today, 09:49 PM" },
];

// Suggestion cards — only what Dactra actually offers
const SUGGESTION_CARDS = [
  {
    icon: <MdOutlineHealthAndSafety size={20} className="text-blue-500" />,
    color: "bg-blue-50",
    title: "Understand a Symptom",
    desc: "Describe what you're feeling and get clear medical information.",
    prompt: "What does it mean if I have persistent headaches and dizziness?",
  },
  {
    icon: <HiOutlineDocumentText size={18} className="text-emerald-500" />,
    color: "bg-emerald-50",
    title: "Learn About a Condition",
    desc: "Get accurate, easy-to-understand info about any medical condition.",
    prompt: "Can you explain what Type 2 diabetes is and how it's managed?",
  },
  {
    icon: <FaRegQuestionCircle size={17} className="text-violet-500" />,
    color: "bg-violet-50",
    title: "About Dactra",
    desc: "What is Dactra and how can it help me with my health questions?",
    prompt: "What is Dactra and what kind of information can I find here?",
  },
];

// ─── ANIMATIONS ──────────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring", stiffness: 280, damping: 26, delay },
});

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.12 } },
};

const staggerItem = {
  hidden: { opacity: 0, x: -14 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 28 },
  },
};

// ─── ORB ─────────────────────────────────────────────────────────────────────

function DactraIcon() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0], scale: [1, 1.04, 1] }}
      transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      className="relative mb-6"
    >
      {/* Glow behind icon */}
      <motion.div
        animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-blue-400"
        style={{ filter: "blur(20px)", transform: "scale(1.2)" }}
      />
      <motion.div
        animate={{ scale: [1, 2, 1], opacity: [0.15, 0, 0.15] }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
        className="absolute inset-0 rounded-full bg-blue-200"
        style={{ filter: "blur(30px)", transform: "scale(1.5)" }}
      />
      <img
        src={Icon}
        alt="Dactra"
        className="relative z-10  w-18 h-18 object-contain drop-shadow-lg"
      />
    </motion.div>
  );
}

function MedicalOrb() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
      className="relative w-20 h-20 md:w-24 md:h-24 mb-5"
    >
      <motion.div
        animate={{ scale: [1, 1.5, 1], opacity: [0.25, 0, 0.25] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-full bg-blue-400"
        style={{ filter: "blur(16px)" }}
      />
      <motion.div
        animate={{ scale: [1, 1.9, 1], opacity: [0.12, 0, 0.12] }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.3,
        }}
        className="absolute inset-0 rounded-full bg-blue-300"
        style={{ filter: "blur(24px)" }}
      />
      <div
        className="relative w-full h-full rounded-full flex items-center justify-center"
        style={{
          background:
            "radial-gradient(circle at 38% 36%, #7ec8ff, #1a6dd4 55%, #0a3270)",
          boxShadow: "0 8px 32px rgba(26,109,212,0.45)",
        }}
      >
        <div
          className="absolute rounded-full"
          style={{
            top: "13%",
            left: "19%",
            width: "40%",
            height: "30%",
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.42) 0%, transparent 100%)",
            filter: "blur(2px)",
          }}
        />
        <img src={Icon} alt="" />
        {/* <MdOutlineHealthAndSafety
          size={36}
          color="rgba(255,255,255,0.9)"
          className="relative z-10"
        /> */}
      </div>
    </motion.div>
  );
}

// ─── TYPING INDICATOR ─────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      className="flex items-start gap-2.5"
    >
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-[10px] font-black flex-shrink-0 shadow">
        D
      </div>
      <div className="bg-white border border-blue-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 0.18, 0.36].map((d, i) => (
            <motion.span
              key={i}
              animate={{ scale: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 1.1, repeat: Infinity, delay: d }}
              className="w-1.5 h-1.5 rounded-full bg-blue-400 block"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── MESSAGE ──────────────────────────────────────────────────────────────────

function Message({ msg }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-black flex-shrink-0 shadow
          ${isUser ? "bg-gradient-to-br from-slate-600 to-slate-800" : "bg-gradient-to-br from-blue-500 to-cyan-400"}`}
      >
        {isUser ? "U" : "D"}
      </div>
      <div
        className={`max-w-[70%] sm:max-w-[60%] px-4 py-2.5 text-sm leading-relaxed shadow-sm
          ${
            isUser
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl rounded-br-sm"
              : "bg-white text-slate-700 border border-blue-100 rounded-2xl rounded-bl-sm"
          }`}
      >
        {msg.text}
      </div>
    </motion.div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────

function Sidebar({ active, setActive, open, setOpen }) {
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/30 z-20 lg:hidden pt-[10px]"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={{ x: -260, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
        className={`
          fixed lg:relative z-30 lg:z-auto
          h-full w-56 flex flex-col flex-shrink-0
          bg-white border-r border-blue-100 shadow-sm
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="pt-[8px] w-fit pl-[10px] ">
          <BrandLogo size="size-[30px]" textSize="text-[20px]" />
        </div>

        {/* Nav */}
        <motion.nav
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex-1 px-2 py-3 overflow-y-auto"
        >
          {NAV_ITEMS.map((n) => (
            <motion.button
              key={n.id}
              variants={staggerItem}
              whileHover={{ x: 3, backgroundColor: "#eff6ff" }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setActive(n.id);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium mb-0.5 cursor-pointer border-none text-left transition-colors
                ${active === n.id ? "bg-blue-50 text-blue-700 font-semibold" : "text-slate-500 bg-transparent"}`}
            >
              <n.icon className="w-4 h-4 flex-shrink-0" />
              {n.label}
              {n.badge && (
                <span className="ml-auto bg-blue-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
                  {n.badge}
                </span>
              )}
            </motion.button>
          ))}

          {/* Recent */}
          <p className="text-[9px] uppercase tracking-widest font-bold text-slate-300 px-3 pt-4 pb-1.5">
            Recent
          </p>
          {RECENT_CHATS.map((c, i) => (
            <motion.div
              key={i}
              variants={staggerItem}
              whileHover={{ backgroundColor: "#f0f6ff" }}
              className="flex items-start gap-2 px-3 py-1.5 rounded-lg cursor-pointer"
            >
              <RiChatAiLine className="w-3 h-3 text-blue-200 mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-[11.5px] font-medium text-slate-600 truncate">
                  {c.text}
                </p>
                <p className="text-[10px] text-slate-400">{c.time}</p>
              </div>
            </motion.div>
          ))}

          <motion.button
            variants={staggerItem}
            whileHover={{ backgroundColor: "#eff6ff" }}
            whileTap={{ scale: 0.97 }}
            className="mx-2 mt-2 w-[calc(100%-16px)] py-1.5 text-[11px] font-semibold text-blue-500 border border-blue-100 rounded-lg bg-transparent cursor-pointer"
          >
            Show More
          </motion.button>
        </motion.nav>

        {/* User */}
        <div className="border-t border-blue-50 px-3 py-3 flex items-center gap-2.5">
          <AvatarIcon />
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-slate-800 truncate">
              My Account
            </p>
            <p className="text-[10px] text-slate-400 truncate">dactra.com</p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

// ─── TOPBAR ───────────────────────────────────────────────────────────────────

function Topbar({ onNewChat, onMenuToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, type: "spring", stiffness: 260, damping: 24 }}
      className="flex items-center justify-between px-4 md:px-5 py-3.5 bg-white border-b border-blue-100 flex-shrink-0 gap-3"
    >
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={onMenuToggle}
          className="lg:hidden text-slate-500 cursor-pointer bg-transparent border-none p-1"
        >
          <HiBars3 className="w-5 h-5" />
        </motion.button>
        <h1 className="text-base md:text-[17px] font-extrabold text-blue-900 tracking-tight">
          Medical Assistant
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ backgroundColor: "#eff6ff" }}
          whileTap={{ scale: 0.97 }}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-xl text-[12px] text-blue-600 font-semibold cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          Dactra AI
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.04, backgroundColor: "#1558b0" }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 bg-blue-500 text-white text-[12px] md:text-[13px] font-bold rounded-xl border-none cursor-pointer shadow-md shadow-blue-200"
        >
          <HiPlus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
          <span className="sm:hidden">New</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── WELCOME ──────────────────────────────────────────────────────────────────

function WelcomeScreen({ onQuickAsk }) {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.25 }}
      className="flex-1 flex flex-col items-center justify-center px-6 pb-4 pt-6"
    >
      {/* <MedicalOrb /> */}

      <DactraIcon />

      <motion.h1
        {...fadeUp(0.12)}
        className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-tight mb-3 text-center"
      >
        Welcome to <span className="text-blue-500">Dactra</span>
      </motion.h1>

      <motion.p
        {...fadeUp(0.2)}
        className="text-sm text-slate-400 text-center leading-relaxed mb-8 max-w-sm"
      >
        Ask me anything about symptoms, conditions, medications, or how Dactra
        can help you. I'll give you clear, reliable medical information.
      </motion.p>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-2xl"
      >
        {SUGGESTION_CARDS.map((c) => (
          <motion.button
            key={c.title}
            variants={{
              hidden: { opacity: 0, y: 18, scale: 0.96 },
              show: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: "spring", stiffness: 280, damping: 24 },
              },
            }}
            whileHover={{
              y: -4,
              boxShadow: "0 8px 28px rgba(26,109,212,0.15)",
              borderColor: "#93c5fd",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onQuickAsk(c.prompt)}
            className="bg-white border border-blue-100 rounded-2xl p-4 text-left cursor-pointer transition-colors"
          >
            <div
              className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center mb-3`}
            >
              {c.icon}
            </div>
            <p className="text-[13px] font-bold text-blue-900 mb-1.5">
              {c.title}
            </p>
            <p className="text-[11.5px] text-slate-400 leading-snug">
              {c.desc}
            </p>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}

// ─── INPUT BAR ────────────────────────────────────────────────────────────────

function InputBar({ onSend, disabled }) {
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [toast, setToast] = useState("");
  const inputRef = useRef(null);
  const MAX = 1500;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2200);
  };

  const handleSend = () => {
    const t = text.trim();
    if (!t || disabled) return;
    onSend(t);
    setText("");
    inputRef.current?.focus();
  };

  // Prompts relevant to Dactra only
  const browseMedicalPrompts = () => {
    const prompts = [
      "What are the early signs of diabetes?",
      "How does high blood pressure affect the heart?",
      "What is the difference between a virus and bacteria?",
      "What does Dactra offer for health information?",
      "Is it safe to take ibuprofen daily?",
    ];
    setText(prompts[Math.floor(Math.random() * prompts.length)]);
    inputRef.current?.focus();
  };

  return (
    <div className="px-4 md:px-5 pb-4 flex-shrink-0">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-2 text-center text-[12px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 rounded-xl py-2"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 24 }}
        className="bg-white rounded-2xl border-2 border-blue-200 shadow-lg shadow-blue-100/50 focus-within:border-blue-400 transition-all"
      >
        <div className="flex items-center gap-3 px-4 pt-3.5 pb-2.5">
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask a medical question or about Dactra..."
            className="flex-1 border-none outline-none text-[13.5px] text-slate-700 bg-transparent placeholder-slate-300 font-medium"
          />
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "#1558b0" }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!text.trim() || disabled}
            className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0 border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-blue-200"
          >
            <LuSendHorizontal className="w-3.5 h-3.5 text-white" />
          </motion.button>
        </div>

        {/* <div className="flex items-center gap-1.5 px-3.5 pb-3 pt-0.5 border-t border-blue-50 flex-wrap">
          {[
            {
              icon: <GoPaperclip className="w-3.5 h-3.5" />,
              label: "Attach",
              onClick: () => showToast("📎 File attachment coming soon!"),
            },
            {
              icon: <HiOutlineMicrophone className="w-3.5 h-3.5" />,
              label: recording ? "Stop" : "Voice",
              onClick: () => {
                setRecording((r) => !r);
                if (!recording) showToast("🎙️ Voice input coming soon!");
              },
              active: recording,
            },
            {
              icon: <MdOutlineHealthAndSafety className="w-3.5 h-3.5" />,
              label: "Medical Prompts",
              onClick: browseMedicalPrompts,
            },
          ].map((b) => (
            <motion.button
              key={b.label}
              whileHover={{
                y: -1,
                backgroundColor: b.active ? "#1558b0" : "#eff6ff",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={b.onClick}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11.5px] font-semibold border cursor-pointer transition-colors
                ${
                  b.active
                    ? "bg-blue-500 text-white border-blue-500"
                    : "bg-blue-50 text-blue-500 border-blue-100"
                }`}
            >
              {b.icon}
              <span className="hidden sm:inline">{b.label}</span>
            </motion.button>
          ))}
          <span
            className={`ml-auto text-[11px] font-semibold ${text.length > 1400 ? "text-red-400" : "text-slate-300"}`}
          >
            {text.length} / {MAX}
          </span>
        </div> */}
      </motion.div>

      <p className="text-center text-[11px] text-slate-300 mt-2">
        Dactra provides general medical information only — not a substitute for
        professional medical advice.{" "}
        <a href="#" className="text-blue-400 font-semibold hover:underline">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function DactraChat() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [activeNav, setActiveNav] = useState("chat");
  const [sideOpen, setSideOpen] = useState(false);
  const bottomRef = useRef(null);

  // Build conversation history for API (includes system prompt)
  const historyRef = useRef([{ role: "system", content: SYSTEM_PROMPT }]);

  const isWelcome = messages.length === 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    if (isTyping) return;

    // Add user message to UI + history
    setMessages((p) => [...p, { id: Date.now(), role: "user", text }]);
    historyRef.current.push({ role: "user", content: text });
    setIsTyping(true);

    try {
      const reply = await callAI(historyRef.current);
      historyRef.current.push({ role: "assistant", content: reply });
      setMessages((p) => [
        ...p,
        { id: Date.now() + 1, role: "ai", text: reply },
      ]);
    } catch {
      const errMsg = "Sorry, I couldn't connect right now. Please try again.";
      setMessages((p) => [
        ...p,
        { id: Date.now() + 1, role: "ai", text: errMsg },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setIsTyping(false);
    historyRef.current = [{ role: "system", content: SYSTEM_PROMPT }];
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        background: "#f4f6f9",
        backgroundImage:
          "radial-gradient(circle, #c5d8f0 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      <Sidebar
        active={activeNav}
        setActive={setActiveNav}
        open={sideOpen}
        setOpen={setSideOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden bg-white/70 backdrop-blur-sm">
        <Topbar
          onNewChat={handleNewChat}
          onMenuToggle={() => setSideOpen(true)}
        />

        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {isWelcome ? (
              <WelcomeScreen key="welcome" onQuickAsk={handleSend} />
            ) : (
              <motion.div
                key="msgs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-4 px-4 md:px-6 py-5"
              >
                {messages.map((m) => (
                  <Message key={m.id} msg={m} />
                ))}
                <AnimatePresence>
                  {isTyping && <TypingDots key="typing" />}
                </AnimatePresence>
                <div ref={bottomRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <InputBar onSend={handleSend} disabled={isTyping} />
      </div>
    </div>
  );
}
