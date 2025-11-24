import { motion } from "framer-motion";
import {
  MdCalendarToday,
  MdPayment,
  MdQuestionAnswer,
  MdStarRate,
  MdPeople,
  MdTrendingUp,
} from "react-icons/md";
import HeaderSection from "./HeaderSection";

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const stats = [
  {
    icon: MdCalendarToday,
    value: "50K+",
    label: "Appointments",
  },
  {
    icon: MdPayment,
    value: "$2M+",
    label: "Revenue",
  },
  {
    icon: MdStarRate,
    value: "4.8",
    label: "Avg Rating",
  },
  {
    icon: MdPeople,
    value: "10K+",
    label: "Patients",
  },
  {
    icon: MdQuestionAnswer,
    value: "5K+",
    label: "Q&A",
  },
  {
    icon: MdTrendingUp,
    value: "150%",
    label: "Growth",
  },
];

export default function StatisticsSection() {
  return (
    <div className="flex flex-col gap-8 justify-center items-center relative z-40 px-4 w-full">
      <HeaderSection
        leftText="Platform"
        gradientText="Statistics"
        rightText=""
        description="Join thousands of healthcare providers who trust Dactra to grow their practice and serve more patients."
      />

      <div className="w-full max-w-6xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              variants={scaleIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.03 }}
              className="group relative bg-white rounded-xl p-3 md:p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 text-center"
            >
              <div className="flex justify-center mb-2">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="p-2 md:p-3 bg-[#EFF9FF] rounded-lg group-hover:bg-[#316BE8] transition-colors"
                >
                  <Icon className="text-lg md:text-xl text-[#0069AB] group-hover:text-white transition-colors" />
                </motion.div>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-[#316BE8] mb-1">
                {stat.value}
              </h3>
              <p className="text-xs md:text-sm text-[#6D6D6D]">
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

