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

export default function Footer() {
  const year = new Date().getFullYear();

  const container = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Hover animation: scale + slight lift
  const socialHover = {
    scale: 1.2,
    y: -5, // تعلي شوية
    transition: { type: "spring", stiffness: 300 },
  };

  return (
    <motion.footer
      className="bg-gray-900 text-gray-300 w-full absolute bottom-0 left-0"
      initial="hidden"
      whileInView="show" // هنا استخدمنا whileInView
      viewport={{ once: true, amount: 0.2 }} // يظهر الانيميشن لما يبقى 20% من الفوتر ظاهر
      variants={container}
    >
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <motion.div variants={item} className="space-y-6">
            <h3 className="text-3xl font-bold text-white flex items-center gap-3">
              Dactra
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Your trusted medical platform for instant consultations and
              booking appointments with top doctors, anytime, anywhere.
            </p>

            {/* Social Icons */}
            <div className="flex gap-5">
              <motion.a
                href="#"
                className="group bg-gray-800 p-3 rounded-full transition-all duration-300 hover:bg-[#1877F2]"
                whileHover={socialHover}
              >
                <FaFacebookF className="w-5 h-5 text-white group-hover:text-white" />
              </motion.a>

              <motion.a
                href="#"
                className="group bg-gray-800 p-3 rounded-full transition-all duration-300 hover:bg-black"
                whileHover={socialHover}
              >
                <SiX className="w-5 h-5 text-white group-hover:text-white" />
              </motion.a>

              <motion.a
                href="#"
                className="group bg-gray-800 p-3 rounded-full transition-all duration-300 hover:bg-gradient-to-tr hover:from-purple-600 hover:via-pink-500 hover:to-orange-400"
                whileHover={socialHover}
              >
                <FaInstagram className="w-5 h-5 text-white group-hover:text-white" />
              </motion.a>

              <motion.a
                href="#"
                className="group bg-gray-800 p-3 rounded-full transition-all duration-300 hover:bg-[#0A66C2]"
                whileHover={socialHover}
              >
                <FaLinkedinIn className="w-5 h-5 text-white group-hover:text-white" />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={item}>
            <h3 className="text-xl font-semibold text-white mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              {[
                "Home",
                "Find a Doctor",
                "Specialties",
                "Appointments",
                "Blog",
              ].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-blue-400 transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div variants={item}>
            <h3 className="text-xl font-semibold text-white mb-6">Support</h3>
            <ul className="space-y-4">
              {[
                "Help Center",
                "Privacy Policy",
                "Terms of Service",
                "FAQs",
                "Contact Us",
              ].map((link) => (
                <li key={link}>
                  <a href="#" className="hover:text-blue-400 transition">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={item} className="space-y-5">
            <h3 className="text-xl font-semibold text-white mb-6">
              Get in Touch
            </h3>
            <div className="space-y-4 text-gray-400">
              <p className="flex items-center gap-3">
                <FaEnvelope className="text-blue-500" /> support@dactra.com
              </p>
              <p className="flex items-center gap-3">
                <FaPhone className="text-blue-500" /> +966 50 123 4567
              </p>
              <p className="flex items-center gap-3">
                <FaClock className="text-blue-500" /> 24/7 Support
              </p>
              <p className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-blue-500" /> Cairo, Egypt
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer Bottom */}
        <motion.div
          variants={item}
          className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm"
        >
          <p>© {year} Dactra. All rights reserved.</p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
