import { motion } from "framer-motion";

export default function SpecialistCard({ name, icon }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: Math.random() * 0.3 }}
      viewport={{ once: true, amount: 0.5 }}
      whileHover={{
        scale: 1.07,
        rotate: 1,
        boxShadow: "0px 10px 25px rgba(0,0,0,0.12)",
      }}
      className="flex flex-col justify-center w-[130px] h-[150px] md:w-[150px] md:h-[170px] items-center gap-[10px] md:gap-[20px] rounded-[20px] bg-[#F9F9F9] cursor-pointer"
    >
      <img
        loading="lazy"
        alt="specialist icon"
        src={icon}
        className=" size-[40px] md:size-[50px]  "
      />
      <p className="font-medium">{name}</p>
    </motion.div>
  );
}
