import { motion } from "framer-motion";
import { FaUserDoctor } from "react-icons/fa6";
import { GiLabCoat } from "react-icons/gi";
import { FaXRay } from "react-icons/fa";
import HeaderSection from "./HeaderSection";

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const services = [
  {
    icon: FaUserDoctor,
    title: "Doctors",
    description:
      "Online/video consultations - Set your own fees & get paid instantly",
  },
  {
    icon: GiLabCoat,
    title: "Medical Labs",
    description:
      "Add test prices & timings - Appear to patients searching nearby",
  },
  {
    icon: FaXRay,
    title: "Radiology Centers",
    description:
      "List X-ray, MRI, CT, Ultrasound prices - Get recommended automatically",
  },
];

export default function ServicesPricingSection() {
  return (
    <div className="flex flex-col gap-8 justify-center items-center relative z-40 px-4">
      <HeaderSection
        leftText="Start Making Money"
        gradientText="From Day One"
        description="Set up your services and pricing in less than 5 minutes and instantly
        start receiving online consultations, receiving lab/imaging referrals,
        or getting e-prescriptions sent straight to your pharmacy."
      />

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg p-6 md:p-10 flex flex-col gap-6">
        <h2 className="text-2xl md:text-3xl font-bold text-[#3D3D3D] text-center">
          Set Your Services & Prices
        </h2>

        <div className="flex flex-col md:flex-row gap-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                variants={scaleIn}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-1 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <Icon className="text-2xl text-[#0069AB] mb-3" />
                <h3 className="text-lg font-bold text-[#316BE8] mb-2">
                  {service.title}
                </h3>
                <p className="text-[#6D6D6D] text-xs md:text-sm">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#316BE8] text-white font-semibold py-3 px-6 rounded-lg hover:bg-[#2556d1] transition-colors"
        >
          Add Services & Pricing Now
        </motion.button>
      </div>
    </div>
  );
}
