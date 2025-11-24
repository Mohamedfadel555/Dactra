import { motion } from "framer-motion";
import HeaderSection from "./HeaderSection";
import {
  MdCalendarToday,
  MdPayment,
  MdQuestionAnswer,
  MdArticle,
  MdStarRate,
  MdSchedule,
} from "react-icons/md";

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const features = [
  {
    icon: MdSchedule,
    title: "Schedule Management",
    description:
      "Set your working hours, manage availability, and organize all your appointments in one place. Block times, set recurring schedules, and never miss an appointment.",
  },
  {
    icon: MdCalendarToday,
    title: "Appointment Tracking",
    description:
      "View all upcoming, past, and cancelled appointments. Access patient history, manage appointment status, and send automatic reminders to reduce no-shows.",
  },
  {
    icon: MdPayment,
    title: "Secure Payments",
    description:
      "Get paid instantly when patients book your services. Track all transactions, view payment history, and manage your earnings with detailed financial reports.",
  },
  {
    icon: MdQuestionAnswer,
    title: "Answer Questions",
    description:
      "Help patients by answering medical questions in your specialty. Build your reputation, showcase your expertise, and attract more patients through valuable health content.",
  },
  {
    icon: MdArticle,
    title: "Create Articles",
    description:
      "Share your medical knowledge through articles and posts. Educate patients, establish authority in your field, and improve your visibility in search results.",
  },
  {
    icon: MdStarRate,
    title: "Ratings & Reviews",
    description:
      "Build trust through patient reviews and ratings. Higher-rated providers appear first in search results, helping you attract more patients and grow your practice.",
  },
];

export default function PlatformFeaturesSection() {
  return (
    <div className="flex flex-col gap-8 justify-center items-center relative z-40 px-4">
      <HeaderSection
        leftText="Manage Your"
        gradientText="Practice"
        rightText="Efficiently"
        description="Dactra provides comprehensive tools to help you manage every aspect of your healthcare practice. From scheduling to payments, we've got you covered."
      />

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              variants={scaleIn}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[#EFF9FF] rounded-lg">
                  <Icon className="text-2xl text-[#0069AB]" />
                </div>
                <h3 className="text-xl font-bold text-[#316BE8]">
                  {feature.title}
                </h3>
              </div>
              <p className="text-[#6D6D6D] text-sm">
                {feature.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

