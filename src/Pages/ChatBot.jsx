import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TypingDots from "../Components/ChatBot/TypingDots";
import Message from "../Components/ChatBot/Message";
import AnalysisPanel from "../Components/ChatBot/AnalysisPanel";
import Sidebar from "../Components/ChatBot/Sidebar";
import Topbar from "../Components/ChatBot/Topbar";
import WelcomeScreen from "../Components/ChatBot/WelcomeScreen";
import InputBar from "../Components/ChatBot/InputBar";

// configs
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const REQUEST_TIMEOUT = 90_000;

// models
const MODEL_CHAIN = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-3.1-flash-lite",
];

// prompts
const buildChatSystem = () =>
  `You are Dactra, a friendly and trustworthy medical AI assistant built into the Dactra platform.

About you:
- Your name is Dactra.
- You are a medical assistant powered by Gemini AI.
- You help users with medical questions, health information, understanding symptoms, and analyzing medical images or files.
- You can analyze images such as skin conditions, rashes, wounds, X-rays, MRI scans, CT scans, lab results, and PDF medical reports.
- If someone asks who you are, tell them: "I'm Dactra, your AI medical assistant. I can answer medical questions, analyze images of skin conditions or injuries, review lab results, and help you understand medical scans."

Language rule (STRICT):
- You MUST respond in the language that the user starts with for ALL your replies, unless the user explicitly asks you to switch language.
- Do not switch language on your own for any reason.

Rules:
- Answer medical/health questions clearly in simple language.
- If a user sends an image (skin problem, rash, wound, scan, etc.), describe your observations clearly and helpfully.
- Off-topic requests (cooking, sports, coding, etc.): politely say you are only here for medical information and Dactra-related questions.
- Never diagnose or prescribe medications.
- Emergency symptoms (chest pain, difficulty breathing, fainting, severe bleeding, stroke): immediately say this sounds urgent and advise calling emergency services or going to the nearest hospital right away.
- End every medical answer with a note that this is general information and the user should consult a doctor for personal medical advice.

Formatting:
- Use **bold** for important terms or values.
- Use bullet lists for multiple points.
- Use ### headings to separate sections when the answer is long.
- Keep responses concise and well-structured.`;

const buildAnalysisSystem = () =>
  `You are Dactra, an expert medical analysis AI assistant built into the Dactra platform.

About you:
- Your name is Dactra.
- You analyze medical images, scans, lab reports, and PDF documents and they must be in medicals field only.
- You can analyze: X-rays, MRI, CT scans, ultrasound, blood tests, skin conditions, rashes, wounds, and any other medical image or document.


Language rule (STRICT):
- You MUST respond in the language that the user starts with for ALL your replies, unless the user explicitly asks you to switch language.

Rules:
- Analyze all uploaded files thoroughly and describe observations clearly.
- For lab reports: explain each value in plain language, note normal vs abnormal.
- For images (skin, wounds, scans): describe what you observe and provide helpful information.
- Emergency signs: immediately advise calling emergency services or going to the nearest hospital.
- Never diagnose or prescribe medications.
- End every analysis with a note that this is general information and the user should consult a doctor for personal medical advice.

Formatting:
- Use ### for section headings (e.g., ### Observations, ### Key Values, ### Summary).
- Use **bold** for important findings and abnormal values.
- Use tables (| Val
ue | Result | Norma
l Range | Status |) for lab results when applicable.
- Use checkmark emoji for normal values and warning emoji for abnormal ones.
- Use bullet points for listing observations.
- Be thorough but organized.`;

// lang
function detectLanguage(text = "") {
  return /[\u0600-\u06FF]/.test(text) ? "ar" : "en";
}

const EMERGENCY_RE = [
  /chest pain/i,
  /difficulty breathing/i,
  /shortness of breath/i,
  /can't breathe/i,
  /fainting/i,
  /unconscious/i,
  /severe bleeding/i,
  /stroke/i,
  /heart attack/i,
  /ألم في الصدر/,
  /صعوبة تنفس/,
  /نزيف حاد/,
  /فقدان الوعي/,
  /سكتة/,
];
const isEmergency = (text = "") => EMERGENCY_RE.some((r) => r.test(text));

// errors
const ERROR_TYPES = {
  API_KEY: "API_KEY",
  RATE_LIMIT: "RATE_LIMIT",
  TIMEOUT: "TIMEOUT",
  EMPTY: "EMPTY",
  NETWORK: "NETWORK",
  MODEL_ALL_FAILED: "MODEL_ALL_FAILED",
  UNKNOWN: "UNKNOWN",
};

function classifyErrorType(err) {
  const msg = String(err?.message || "");
  if (msg.includes("Missing") || msg.includes("API_KEY_INVALID"))
    return ERROR_TYPES.API_KEY;
  if (msg.includes("RATE_LIMIT") || msg.includes("429"))
    return ERROR_TYPES.RATE_LIMIT;
  if (msg.includes("AbortError") || msg.includes("timeout"))
    return ERROR_TYPES.TIMEOUT;
  if (msg.includes("Empty response")) return ERROR_TYPES.EMPTY;
  if (msg.includes("Failed to fetch") || msg.includes("NetworkError"))
    return ERROR_TYPES.NETWORK;
  if (msg.includes("MODEL_ALL_FAILED")) return ERROR_TYPES.MODEL_ALL_FAILED;
  return ERROR_TYPES.UNKNOWN;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// conversation hist
function buildHistory(messages, maxTurns = 10) {
  const valid = messages.filter((m) => !m.isError && !m.isEmergency && m.text);
  const recent = valid.slice(-(maxTurns * 2));
  return recent.map((m) => {
    const isUser = m.role === "user";
    const parts = [];
    if (isUser && m.attachments) {
      m.attachments.forEach((att) => {
        if (att.type === "image" && att.base64 && att.mimeType) {
          parts.push({
            inline_data: { mime_type: att.mimeType, data: att.base64 },
          });
        }
      });
    }
    parts.push({ text: m.text });
    return { role: isUser ? "user" : "model", parts };
  });
}

async function callGeminiWithFallback({ systemPrompt, contents, retries = 3 }) {
  if (!GEMINI_API_KEY) throw new Error("Missing GEMINI API key");
  let lastError = null;

  for (const model of MODEL_CHAIN) {
    const url = `${GEMINI_BASE}/${model}:generateContent?key=${GEMINI_API_KEY}`;
    const body = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { maxOutputTokens: 4096, temperature: 0.4 },
    };

    let succeeded = false;

    for (let attempt = 0; attempt < retries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
      try {
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: controller.signal,
        });
        clearTimeout(timer);

        if (res.ok) {
          const data = await res.json();
          const text = (data?.candidates?.[0]?.content?.parts || [])
            .map((p) => p.text || "")
            .join("")
            .trim();
          if (!text) throw new Error("Empty response from Gemini");
          return { text, model }; // ✅ نجح، خروج فوري
        }

        if (res.status === 429) {
          const retryAfter = Number(res.headers.get("retry-after"));
          await sleep(
            Number.isFinite(retryAfter) && retryAfter > 0
              ? retryAfter * 1000
              : 3000 * (attempt + 1),
          );
          continue; // حاول تاني مع نفس الموديل
        }

        // 404 أو 400 = الموديل ده مش موجود، انتقل للتالي فوراً
        if (res.status === 404 || res.status === 400) {
          const errBody = await res.json().catch(() => ({}));
          lastError = new Error(
            errBody?.error?.message || `API error ${res.status} on ${model}`,
          );
          break; // اخرج من loop الـ retries وجرب الموديل الجاي
        }

        const errBody = await res.json().catch(() => ({}));
        lastError = new Error(
          errBody?.error?.message || `API error ${res.status}`,
        );
        // خطأ تاني - حاول مرة كمان
        if (attempt < retries - 1) await sleep(2000 * (attempt + 1));
      } catch (err) {
        clearTimeout(timer);
        lastError = err;
        if (err.name === "AbortError") break; // timeout = انتقل للموديل الجاي
        if (attempt < retries - 1) await sleep(2000 * (attempt + 1));
      }
    }

    // لو succeeded مش true، الـ loop الخارجي هيكمل للموديل الجاي تلقائياً
  }

  throw new Error(
    `MODEL_ALL_FAILED: tried ${MODEL_CHAIN.join(" → ")}. Last error: ${lastError?.message || "unknown"}`,
  );
}
async function callGeminiChat({ userMessage, history = [] }) {
  const contents = [
    ...history,
    { role: "user", parts: [{ text: userMessage }] },
  ];
  return callGeminiWithFallback({ systemPrompt: buildChatSystem(), contents });
}

async function callGeminiAnalysis({ userMessage, files = [], history = [] }) {
  const parts = [];
  for (const f of files)
    parts.push({ inline_data: { mime_type: f.mimeType, data: f.base64 } });
  parts.push({ text: userMessage });
  const contents = [...history, { role: "user", parts }];
  return callGeminiWithFallback({
    systemPrompt: buildAnalysisSystem(),
    contents,
  });
}

async function sendMessage({ userMessage, files = [], history = [], lang }) {
  if (isEmergency(userMessage)) {
    return {
      text:
        lang === "ar"
          ? "هذا يبدو عاجلاً — يرجى الاتصال بخدمات الطوارئ أو التوجه إلى أقرب مستشفى فوراً."
          : "This sounds urgent — please call emergency services or go to the nearest hospital right away.",
      model: null,
      isEmergency: true,
    };
  }
  if (files.length > 0)
    return callGeminiAnalysis({ userMessage, files, history });
  return callGeminiChat({ userMessage, history });
}
export default function DactraChat() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isAnalysisTyping, setIsAnalysisTyping] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [activeNav, setActiveNav] = useState("chat");
  const [sideOpen, setSideOpen] = useState(false);
  const [lang, setLang] = useState(null);
  const bottomRef = useRef(null);

  const isWelcome = messages.length === 0 && activeNav === "chat";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, isAnalysisTyping]);

  const handleSend = async (text, fileAttachments = null) => {
    if (isTyping || isAnalysisTyping) return;
    if (activeNav === "analysis") setActiveNav("chat");

    const detectedLang = detectLanguage(text);
    const currentLang = lang ?? detectedLang;
    if (!lang) setLang(currentLang);

    const isFile = !!(fileAttachments && fileAttachments.length > 0);

    const history = buildHistory(messages);

    setMessages((p) => [
      ...p,
      {
        id: Date.now(),
        role: "user",
        text,
        lang: detectedLang,
        attachments: isFile
          ? fileAttachments.map((f) => ({
              type: f.type,
              preview: f.preview,
              name: f.name,
              base64: f.base64,
              mimeType: f.mimeType,
            }))
          : null,
      },
    ]);

    if (isFile) setIsAnalysisTyping(true);
    else setIsTyping(true);
    setRetrying(false);

    const retryTimer = setTimeout(() => setRetrying(true), 6000);

    try {
      const result = await sendMessage({
        userMessage: text,
        files: isFile
          ? fileAttachments.map((f) => ({
              base64: f.base64,
              mimeType: f.mimeType,
            }))
          : [],
        history,
        lang: currentLang,
      });

      setMessages((p) => [
        ...p,
        {
          id: Date.now() + 1,
          role: isFile ? "analysis" : "ai",
          text: result.text,
          lang: currentLang,
          model: result.model,
          isEmergency: result.isEmergency || false,
        },
      ]);
    } catch (err) {
      console.error("[DactraChat]", err);
      const errorType = classifyErrorType(err);
      setMessages((p) => [
        ...p,
        {
          id: Date.now() + 1,
          role: isFile ? "analysis" : "ai",
          isError: true,
          errorType,
          rawErrorMessage: err?.message || "",
          lang: currentLang,
        },
      ]);
    } finally {
      clearTimeout(retryTimer);
      setIsTyping(false);
      setIsAnalysisTyping(false);
      setRetrying(false);
    }
  };

  const handleNewChat = () => {
    messages.forEach((msg) => {
      msg.attachments?.forEach((att) => {
        if (att.preview) URL.revokeObjectURL(att.preview);
      });
    });
    setMessages([]);
    setIsTyping(false);
    setIsAnalysisTyping(false);
    setRetrying(false);
    setLang(null);
    setActiveNav("chat");
  };

  const renderMain = () => {
    if (activeNav === "analysis") return <AnalysisPanel onSend={handleSend} />;
    return (
      <>
        <div className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            {isWelcome ? (
              <WelcomeScreen
                key="welcome"
                onQuickAsk={handleSend}
                setActiveNav={setActiveNav}
              />
            ) : (
              <motion.div
                key="msgs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-4 px-4 md:px-6 py-5"
              >
                {messages.map((m) => (
                  <Message key={m.id} msg={m} lang={lang} />
                ))}
                <AnimatePresence>
                  {(isTyping || isAnalysisTyping) && (
                    <TypingDots
                      key="typing"
                      retrying={retrying}
                      isAnalysis={isAnalysisTyping}
                    />
                  )}
                </AnimatePresence>
                <div ref={bottomRef} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <InputBar
          onSend={handleSend}
          disabled={isTyping || isAnalysisTyping}
          lang={lang}
        />
      </>
    );
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
        activeNav={activeNav}
        setActive={setActiveNav}
        open={sideOpen}
        setOpen={setSideOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden bg-white/70 backdrop-blur-sm">
        <Topbar
          activeNav={activeNav}
          onNewChat={handleNewChat}
          onMenuToggle={() => setSideOpen(true)}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          {renderMain()}
        </div>
      </div>
    </div>
  );
}
