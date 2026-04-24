import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaUserMd,
  FaComments,
  FaBookMedical,
  FaHeartbeat,
  FaPills,
  FaShieldAlt,
} from "react-icons/fa";
import { HiChevronRight } from "react-icons/hi";

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const stagger = {
  show: { transition: { staggerChildren: 0.08 } },
};

export default function AboutUsPage() {
  return (
    <div className="min-h-screen bg-[#050816] text-white font-english overflow-x-hidden">
      {/* Hero */}
      <section className="relative pt-[88px] pb-20 md:pb-28 px-4 md:px-10">
        <div
          className="pointer-events-none absolute inset-0 opacity-90"
          style={{
            background:
              "radial-gradient(ellipse 80% 55% at 50% -10%, rgba(49,107,232,0.45), transparent 55%), radial-gradient(ellipse 60% 40% at 100% 0%, rgba(34,211,238,0.12), transparent 50%)",
          }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M60%200H0v60%22%20fill%3D%22none%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.04)%22%2F%3E%3C%2Fsvg%3E')] opacity-40" />

        <motion.div
          className="relative max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="inline-flex items-center gap-2 text-[11px] md:text-xs font-bold tracking-[0.28em] text-cyan-300/90 uppercase mb-5">
            <FaShieldAlt className="w-3.5 h-3.5" />
            Medical Consultation Platform
          </p>
          <h1 className="text-[2.1rem] sm:text-4xl md:text-5xl lg:text-[3.25rem] font-extrabold leading-[1.08] tracking-tight text-white">
            One platform for{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-blue-300">
              consultations, data & care continuity
            </span>
          </h1>
          <p className="mt-6 text-slate-300 text-[15px] md:text-lg max-w-2xl mx-auto leading-relaxed">
            Dactra bridges patients, doctors, and pharmacy context—so follow-up,
            education, and access are not limited by location or waiting-room
            logistics.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to="/doctors"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#316BE8] text-white text-sm font-bold shadow-[0_0_40px_rgba(49,107,232,0.45)] hover:bg-[#4a7ef0] transition-colors"
            >
              Explore doctors
              <HiChevronRight className="w-4 h-4" />
            </Link>
            <Link
              to="/Community/Posts"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/15 bg-white/5 text-white text-sm font-semibold hover:bg-white/10 backdrop-blur-sm transition-colors"
            >
              Community
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="relative max-w-5xl mx-auto mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
        >
          {[
            ["Online visits", "Video-ready workflows"],
            ["Health profile", "History & vitals in one place"],
            ["Knowledge hub", "Articles & Q&A"],
            ["Pharmacy aware", "Prescription + availability"],
          ].map(([t, s], i) => (
            <motion.div
              key={t}
              variants={fade}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 md:px-5 md:py-5 backdrop-blur-md"
            >
              <p className="text-sm md:text-base font-bold text-white">{t}</p>
              <p className="text-[11px] md:text-xs text-slate-400 mt-1 leading-snug">
                {s}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Light content band */}
      <section className="relative bg-slate-50 text-slate-900 rounded-t-[2.5rem] -mt-8 shadow-[0_-24px_80px_rgba(0,0,0,0.35)]">
        <div className="max-w-6xl mx-auto px-4 md:px-10 py-16 md:py-24">
          <motion.div
            className="max-w-3xl mb-14 md:mb-20"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Why this project exists
            </h2>
            <p className="mt-4 text-slate-600 text-[15px] md:text-base leading-relaxed">
              Traditional care is often constrained by geography, schedules, and
              fragmented information. We built a digital layer that keeps the
              human relationship at the center while making records, questions,
              and prescriptions easier to use together—not as a replacement for
              in-person care when it is needed, but as a continuous companion.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-5 md:gap-6">
            {[
              {
                icon: FaUserMd,
                title: "Online consultation",
                body: "Schedule and conduct video visits. Doctors can reference the patient profile during the conversation.",
              },
              {
                icon: FaComments,
                title: "Medical Q&A forum",
                body: "Patients post questions; doctors respond with multiple perspectives so decisions feel better informed.",
              },
              {
                icon: FaBookMedical,
                title: "Articles & knowledge",
                body: "Verified doctors publish updates, research notes, and prevention tips the whole community can trust.",
              },
              {
                icon: FaHeartbeat,
                title: "Health tracking",
                body: "Log vitals like blood pressure, glucose, heart rate, and weight. Trends support better follow-up and future device sync.",
              },
              {
                icon: FaPills,
                title: "Prescriptions & pharmacies",
                body: "Digital prescriptions with search across online pharmacies—aiming to reduce friction when medicine is hard to find.",
              },
              {
                icon: FaShieldAlt,
                title: "Built to grow",
                body: "Designed for integrations: labs, insurers, devices, and pharmacy chains as partnerships mature.",
              },
            ].map((item, i) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.05, duration: 0.45 }}
                whileHover={{ y: -6 }}
                className="group rounded-2xl bg-white border border-slate-200/80 p-6 md:p-7 shadow-[0_4px_24px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_50px_rgba(49,107,232,0.12)] hover:border-blue-200/60 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#316BE8] to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 mb-4 group-hover:scale-105 transition-transform">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                  {item.body}
                </p>
              </motion.article>
            ))}
          </div>

          <motion.div
            className="mt-16 md:mt-24 rounded-3xl bg-slate-900 text-white p-8 md:p-12 lg:p-14 relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#316BE8]/30 blur-[80px] rounded-full pointer-events-none" />
            <div className="relative grid md:grid-cols-2 gap-10 md:gap-14 items-start">
              <div>
                <h3 className="text-xl md:text-2xl font-bold">Who benefits</h3>
                <ul className="mt-5 space-y-4 text-slate-300 text-sm md:text-[15px] leading-relaxed">
                  <li>
                    <span className="font-semibold text-white">Patients</span> —
                    easier access, clearer context for visits, and smoother paths
                    to medication information.
                  </li>
                  <li>
                    <span className="font-semibold text-white">Doctors</span> —
                    richer profiles, simpler follow-up, and a wider responsible
                    reach.
                  </li>
                  <li>
                    <span className="font-semibold text-white">The ecosystem</span>{" "}
                    — efficiency, shared learning, and less friction around drug
                    availability over time.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl md:text-2xl font-bold">On the roadmap</h3>
                <ul className="mt-5 space-y-3 text-slate-300 text-sm md:text-[15px] leading-relaxed list-disc list-inside marker:text-cyan-400">
                  <li>Insurance verification workflows</li>
                  <li>AI-assisted symptom guidance before consults</li>
                  <li>Native apps with push for appointments & prescriptions</li>
                  <li>Deeper pharmacy partnerships for live stock</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.p
            className="mt-14 text-center text-slate-500 text-sm max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Dactra is a thesis on better-connected healthcare: telemedicine,
            structured data, and thoughtful integrations—so quality and access can
            move in the same direction.
          </motion.p>
        </div>
      </section>
    </div>
  );
}
