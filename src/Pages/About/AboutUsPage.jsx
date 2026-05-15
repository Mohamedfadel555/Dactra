import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  RiHeartPulseLine,
  RiEyeLine,
  RiHandHeartLine,
  RiLockLine,
  RiSpeedLine,
  RiLightbulbLine,
  RiUserHeartLine,
  RiStethoscopeLine,
  RiHospitalLine,
  RiShieldCheckLine,
  RiShieldLine,
  RiCodeSSlashLine,
  RiBrushLine,
  RiBellLine,
  RiRobot2Line,
  RiFileTextLine,
  RiMapPinLine,
  RiUserAddLine,
  RiCompassLine,
} from "react-icons/ri";

// ── Animation Variants ──────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

// ── Data ─────────────────────────────────────────────────────────────
const stats = [
  { n: "4", l: "User roles" },
  { n: "20+", l: "Platform features" },
  { n: "3", l: "Provider types supported" },
  { n: "1", l: "Connected ecosystem" },
];

const storyBlocks = [
  {
    n: "1",
    title: "The problem was clear",
    body: "Finding a trusted doctor, tracking health data, and navigating labs was fragmented and frustrating for patients everywhere.",
  },
  {
    n: "2",
    title: "We designed around real needs",
    body: "Every feature — from health charts to the AI chatbot — was shaped by what patients and doctors actually needed day-to-day.",
  },
  {
    n: "3",
    title: "Built with modern technology",
    body: "React, Firebase, JWT auth, and an AI-powered medical assistant — all working together in one seamless experience.",
  },
];

const glanceRows = [
  {
    icon: <RiUserHeartLine />,
    label: "Patients",
    value: "Profiles, booking, AI chatbot",
  },
  {
    icon: <RiStethoscopeLine />,
    label: "Doctors",
    value: "Dashboard, deals, articles",
  },
  {
    icon: <RiHospitalLine />,
    label: "Labs & scans",
    value: "Services, deals, referrals",
  },
  {
    icon: <RiShieldLine />,
    label: "Admins",
    value: "Approvals, data, moderation",
  },
];

const values = [
  {
    icon: <RiEyeLine />,
    title: "Transparency",
    body: "Patients see real ratings, credentials, and prices before they ever book. No surprises.",
  },
  {
    icon: <RiUserHeartLine />,
    title: "Accessibility",
    body: "Good healthcare guidance should be available to everyone — regardless of background or location.",
  },
  {
    icon: <RiHandHeartLine />,
    title: "Empathy",
    body: "Every feature is shaped by how real patients and doctors think and feel during their healthcare journey.",
  },
  {
    icon: <RiLockLine />,
    title: "Privacy",
    body: "Medical data is sacred. JWT auth, role-based access, and strict controls keep it safe.",
  },
  {
    icon: <RiSpeedLine />,
    title: "Efficiency",
    body: "Less waiting, less friction. Smarter scheduling, instant referrals, and AI-powered summaries.",
  },
  {
    icon: <RiLightbulbLine />,
    title: "Innovation",
    body: "AI chatbot, push notifications, deal systems — we build what others haven't thought of yet.",
  },
];

const howCards = [
  {
    icon: <RiUserHeartLine />,
    color: "blue",
    title: "For patients",
    body: "Track vitals, upload medical reports, book appointments, get AI-powered scan summaries, and engage with a real medical community.",
  },
  {
    icon: <RiStethoscopeLine />,
    color: "green",
    title: "For doctors",
    body: "Manage your schedule, publish articles, answer patient questions, and negotiate deals with labs and scan centers — all in one dashboard.",
  },
  {
    icon: <RiHospitalLine />,
    color: "blue",
    title: "For medical providers",
    body: "List your services with prices and hours, receive patient referrals from partner doctors, and manage sponsorship deals efficiently.",
  },
  {
    icon: <RiShieldCheckLine />,
    color: "green",
    title: "For admins",
    body: "Approve new professionals, manage platform data, handle complaints, and keep the entire ecosystem safe and trustworthy.",
  },
];

const techChips = [
  { icon: <RiCodeSSlashLine />, label: "React.js + Vite" },
  { icon: <RiBrushLine />, label: "Tailwind CSS" },
  { icon: <RiLockLine />, label: "JWT authentication" },
  { icon: <RiBellLine />, label: "Firebase push notifications" },
  { icon: <RiRobot2Line />, label: "AI medical chatbot" },
  { icon: <RiFileTextLine />, label: "PDF & image uploads" },
  { icon: <RiMapPinLine />, label: "React Router v6" },
];

// ── Sub-components ────────────────────────────────────────────────────

function Eyebrow({ children }) {
  return (
    <p className="text-[11px] font-semibold tracking-widest uppercase text-[#185FA5] mb-2.5">
      {children}
    </p>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-[24px] font-medium text-gray-900 mb-3 tracking-tight leading-snug">
      {children}
    </h2>
  );
}

function SectionBody({ children }) {
  return (
    <p className="text-[14px] text-gray-500 leading-relaxed max-w-[520px]">
      {children}
    </p>
  );
}

// ── Main Component ─────────────────────────────────────────────────────
export default function AboutUsPage() {
  const navigate = useNavigate();

  return (
    <div className="font-['DM_Sans',sans-serif] overflow-hidden bg-white text-gray-900 antialiased">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-gray-100 text-center px-10 py-[88px]">
        {/* Radial glow */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,#deedfb,transparent_70%)]" />

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-1.5 bg-[#E6F1FB] text-[#0C447C] border border-[#B5D4F4] rounded-full px-3.5 py-1.5 text-xs font-medium mb-6"
          >
            <RiHeartPulseLine className="text-sm" />
            Healthcare, reimagined
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-[42px] font-medium leading-[1.18] tracking-tight max-w-[580px] mb-5"
          >
            We're building the future of{" "}
            <em className="not-italic text-[#185FA5]">connected healthcare</em>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-[15px] text-gray-500 leading-[1.75] max-w-[500px] mb-9"
          >
            Dactra brings patients, doctors, and medical providers together on
            one intelligent platform — making quality care easier to find, book,
            and manage.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex gap-3"
          >
            <motion.button
              whileHover={{ opacity: 0.88, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/auth/Signup")}
              className="bg-[#185FA5] text-[#E6F1FB] rounded-lg px-6 py-[10px] text-[13px] font-medium cursor-pointer"
            >
              Get started free
            </motion.button>
            <motion.button
              whileHover={{ backgroundColor: "#F4F7FA", scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/")}
              className="bg-transparent text-gray-800 border border-gray-300 rounded-lg px-6 py-[10px] text-[13px] cursor-pointer"
            >
              Learn more
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        className="grid grid-cols-4 border-b border-gray-100"
      >
        {stats.map((s, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            custom={i}
            className={`py-7 px-5 text-center ${i < 3 ? "border-r border-gray-100" : ""}`}
          >
            <div className="text-[28px] font-medium text-[#185FA5]">{s.n}</div>
            <div className="text-xs text-gray-400 mt-1">{s.l}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── STORY ── */}
      <section className="px-10 py-16 border-b border-gray-100">
        <div className="grid grid-cols-2 gap-12 items-start">
          {/* Left */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            <motion.div variants={fadeUp}>
              <Eyebrow>Our story</Eyebrow>
            </motion.div>
            <motion.div variants={fadeUp}>
              <SectionTitle>Why we built Dactra</SectionTitle>
            </motion.div>
            <motion.div variants={fadeUp}>
              <SectionBody>
                We saw a healthcare system where patients struggled to find the
                right doctor, doctors drowned in paperwork, and labs had no easy
                way to connect with referrals. Dactra was built to fix all of
                that.
              </SectionBody>
            </motion.div>

            <div className="flex flex-col gap-5 mt-8">
              {storyBlocks.map((b, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i}
                  className="flex gap-3.5"
                >
                  <div className="min-w-[28px] h-7 rounded-full bg-[#E6F1FB] flex items-center justify-center text-xs font-medium text-[#0C447C] mt-0.5 shrink-0">
                    {b.n}
                  </div>
                  <div>
                    <h4 className="text-[14px] font-medium text-gray-900 mb-1">
                      {b.title}
                    </h4>
                    <p className="text-[13px] text-gray-500 leading-[1.65]">
                      {b.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8"
          >
            {/* Quote */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-7">
              <div className="text-[36px] text-[#B5D4F4] leading-none mb-3">
                "
              </div>
              <p className="text-[15px] text-gray-800 leading-[1.7] italic mb-4">
                Healthcare shouldn't feel like navigating a maze. Every patient
                deserves clarity, every doctor deserves efficiency, and every
                interaction should build trust.
              </p>
              <p className="text-xs text-gray-400">— The Dactra team</p>
            </div>

            {/* Glance */}
            <div className="mt-4 bg-gray-50 border border-gray-100 rounded-xl p-5">
              <p className="text-xs font-medium text-gray-800 mb-3.5">
                Platform at a glance
              </p>
              <div className="flex flex-col gap-2.5">
                {glanceRows.map((r, i) => (
                  <div key={i}>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-xs text-gray-500 flex items-center gap-1.5">
                        <span className="text-[14px] text-[#185FA5]">
                          {r.icon}
                        </span>
                        {r.label}
                      </span>
                      <span className="text-xs font-medium text-gray-800">
                        {r.value}
                      </span>
                    </div>
                    {i < glanceRows.length - 1 && (
                      <div className="h-px bg-gray-100" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="px-10 py-16 border-b border-gray-100">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.div variants={fadeUp}>
            <Eyebrow>What we stand for</Eyebrow>
          </motion.div>
          <motion.div variants={fadeUp}>
            <SectionTitle>Our values</SectionTitle>
          </motion.div>
          <motion.div variants={fadeUp}>
            <SectionBody>
              Everything we build goes back to six core principles that guide
              every decision.
            </SectionBody>
          </motion.div>

          <div className="grid grid-cols-3 gap-4 mt-9">
            {values.map((v, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                whileHover={{
                  y: -3,
                  boxShadow: "0 8px 24px rgba(24,95,165,0.09)",
                }}
                className="bg-white border border-gray-100 rounded-xl p-5 cursor-default transition-colors hover:border-[#B5D4F4]"
              >
                <div className="w-9 h-9 rounded-lg bg-[#E6F1FB] flex items-center justify-center text-[17px] text-[#185FA5] mb-3.5">
                  {v.icon}
                </div>
                <h4 className="text-[13px] font-medium text-gray-900 mb-1.5">
                  {v.title}
                </h4>
                <p className="text-xs text-gray-500 leading-[1.65]">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-10 py-16 border-b border-gray-100">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
        >
          <motion.div variants={fadeUp}>
            <Eyebrow>How it works</Eyebrow>
          </motion.div>
          <motion.div variants={fadeUp}>
            <SectionTitle>One platform, four experiences</SectionTitle>
          </motion.div>
          <motion.div variants={fadeUp}>
            <SectionBody>
              Dactra adapts to who you are. The same platform delivers a
              completely tailored experience for each role.
            </SectionBody>
          </motion.div>

          <div className="grid grid-cols-2 gap-4 mt-9">
            {howCards.map((c, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                custom={i}
                whileHover={{
                  y: -3,
                  boxShadow: "0 8px 24px rgba(24,95,165,0.08)",
                }}
                className="flex gap-3.5 p-5 border border-gray-100 rounded-xl bg-white cursor-default transition-colors hover:border-[#B5D4F4]"
              >
                <div
                  className={`min-w-[38px] h-[38px] rounded-lg flex items-center justify-center text-[18px] shrink-0 ${
                    c.color === "blue"
                      ? "bg-[#E6F1FB] text-[#185FA5]"
                      : "bg-[#E1F5EE] text-[#0F6E56]"
                  }`}
                >
                  {c.icon}
                </div>
                <div>
                  <h4 className="text-[13px] font-medium text-gray-900 mb-1.5">
                    {c.title}
                  </h4>
                  <p className="text-xs text-gray-500 leading-[1.6]">
                    {c.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="px-10 py-16 bg-[#E6F1FB] border-t border-[#B5D4F4] text-center"
      >
        <h2 className="text-[28px] font-medium text-[#0C447C] tracking-tight mb-3">
          Ready to experience smarter healthcare?
        </h2>
        <p className="text-[14px] text-[#185FA5] leading-[1.7] mb-7">
          Join Dactra today — whether you're a patient looking for the right
          doctor,
          <br />
          or a doctor ready to streamline your practice.
        </p>
      </motion.section>
    </div>
  );
}
