import { motion } from "framer-motion";

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

export default function ServiceCard({ icon: Icon, header, desc, Big = true }) {
  return (
    <motion.div
      className={`${
        Big ? "md:flex-2" : ""
      } flex-1  h-[300px] lg:h-[350px] rounded-[24px] p-1 hover-gradient`}
      variants={scaleIn}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.75 }}
    >
      <div className="w-full h-full flex flex-col gap-3 rounded-[20px] px-6 py-5 bg-white">
        <Icon
          className="
              flex-shrink-0
              text-[28px] sm:text-[32px] lg:text-[36px] 
              w-[50px] sm:w-[55px] lg:w-[60px] 
              h-[50px] sm:h-[55px] lg:h-[60px] 
              p-2 rounded-lg bg-[#EFF9FF] text-[#0069AB]"
        />
        <h3 className="text-[#316BE8] text-xl sm:text-2xl md:text-[26px] font-bold">
          {header}
        </h3>
        <p className="text-[#6D6D6D] text-sm sm:text-base md:text-[18px]">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}
