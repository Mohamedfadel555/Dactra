import { motion } from "framer-motion";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import { SiX } from "react-icons/si";

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const itemV = {
  hidden: { opacity: 0, y: 40, filter: "blur(4px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 180, damping: 20 },
  },
};

const linkHover = {
  x: 6,
  color: "#60a5fa",
  transition: { type: "spring", stiffness: 400, damping: 20 },
};

const socialHover = {
  scale: 1.25,
  y: -6,
  rotate: [0, -8, 8, 0],
  transition: { type: "spring", stiffness: 350, damping: 15 },
};

// ─── Floating Orb ─────────────────────────────────────────────────────────────

function FloatingOrb({ x, y, size, delay, color }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: color,
        filter: "blur(60px)",
        opacity: 0.12,
      }}
      animate={{ y: [0, -20, 0], x: [0, 10, 0], scale: [1, 1.1, 1] }}
      transition={{
        repeat: Infinity,
        duration: 6 + delay,
        delay,
        ease: "easeInOut",
      }}
    />
  );
}

// ─── Social Icon ──────────────────────────────────────────────────────────────

function SocialIcon({ href, icon: Icon, hoverBg, label }) {
  return (
    <motion.a
      href={href}
      aria-label={label}
      className="group relative bg-gray-800 p-3 rounded-full overflow-hidden"
      whileHover={socialHover}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: hoverBg }}
      />
      <Icon className="relative w-5 h-5 text-white z-10" />
    </motion.a>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
  const year = new Date().getFullYear();

  const links = [
    "Home",
    "Find a Doctor",
    "Specialties",
    "Appointments",
    "Blog",
  ];
  const support = [
    "Help Center",
    "Privacy Policy",
    "Terms of Service",
    "FAQs",
    "Contact Us",
  ];

  const contact = [
    { Icon: FaEnvelope, text: "support@dactra.com" },
    { Icon: FaPhone, text: "+966 50 123 4567" },
    { Icon: FaClock, text: "24/7 Support" },
    { Icon: FaMapMarkerAlt, text: "Cairo, Egypt" },
  ];

  return (
    <motion.footer
      className="relative bg-gray-900 text-gray-300 w-full overflow-hidden"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      variants={containerV}
    >
      {/* ── Floating background orbs ── */}
      <FloatingOrb x="5%" y="10%" size={300} delay={0} color="#3b82f6" />
      <FloatingOrb x="70%" y="5%" size={250} delay={2} color="#8b5cf6" />
      <FloatingOrb x="40%" y="60%" size={200} delay={1.5} color="#06b6d4" />
      <FloatingOrb x="85%" y="50%" size={180} delay={3} color="#3b82f6" />

      {/* ── Top glowing border ── */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, #3b82f6, #8b5cf6, #06b6d4, transparent)",
        }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-16 z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <motion.div variants={itemV} className="space-y-6">
            <motion.h3
              className="text-3xl font-bold text-white"
              whileHover={{
                letterSpacing: "0.05em",
                transition: { duration: 0.3 },
              }}
            >
              Dactra
            </motion.h3>
            <p className="text-gray-400 leading-relaxed">
              Your trusted medical platform for instant consultations and
              booking appointments with top doctors, anytime, anywhere.
            </p>
            <div className="flex gap-3">
              <SocialIcon
                href="#"
                icon={FaFacebookF}
                label="Facebook"
                hoverBg="#1877F2"
              />
              <SocialIcon href="#" icon={SiX} label="X" hoverBg="#000" />
              <SocialIcon
                href="#"
                icon={FaInstagram}
                label="Instagram"
                hoverBg="linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)"
              />
              <SocialIcon
                href="#"
                icon={FaLinkedinIn}
                label="LinkedIn"
                hoverBg="#0A66C2"
              />
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemV}>
            <h3 className="text-xl font-semibold text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {links.map((link) => (
                <li key={link}>
                  <motion.a
                    href="#"
                    className="inline-flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors"
                    whileHover={linkHover}
                  >
                    <motion.span
                      className="text-blue-500 opacity-0 group-hover:opacity-100 text-xs"
                      initial={{ opacity: 0, x: -4 }}
                      whileHover={{ opacity: 1, x: 0 }}
                    >
                      →
                    </motion.span>
                    {link}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={itemV}>
            <h3 className="text-xl font-semibold text-white mb-6">Support</h3>
            <ul className="space-y-4">
              {support.map((link) => (
                <li key={link}>
                  <motion.a
                    href="#"
                    className="inline-flex items-center gap-1 text-gray-400 hover:text-blue-400 transition-colors"
                    whileHover={linkHover}
                  >
                    {link}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemV} className="space-y-5">
            <h3 className="text-xl font-semibold text-white mb-6">
              Get in Touch
            </h3>
            <div className="space-y-4 text-gray-400">
              {contact.map(({ Icon, text }) => (
                <motion.p
                  key={text}
                  className="flex items-center gap-3"
                  whileHover={{
                    x: 4,
                    color: "#9ca3af",
                    transition: { type: "spring", stiffness: 300 },
                  }}
                >
                  <motion.span
                    whileHover={{ scale: 1.3, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Icon className="text-blue-500" />
                  </motion.span>
                  {text}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <motion.div
          variants={itemV}
          className="relative border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm overflow-hidden"
        >
          {/* Animated underline */}
          <motion.div
            className="absolute top-0 left-0 h-[1px] bg-blue-500"
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: "easeInOut", delay: 0.5 }}
          />
          <motion.p
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            © {year} Dactra. All rights reserved.
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
