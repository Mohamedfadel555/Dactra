import { motion } from "framer-motion";

export default function Bar({ number, percent }) {
  return (
    <div className="flex w-full justify-center items-center gap-[10px]">
      {/* العداد */}
      <motion.p
        className="text-[30px]  font-bold text-[#AAAAAA]"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {number}
      </motion.p>

      {/* البار */}
      <div className="w-full h-[15px] rounded-[20px] bg-[#DBDEE1] relative overflow-hidden">
        <motion.div
          className="h-[15px] rounded-[20px] bg-[#EAB308] absolute top-0 left-0"
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
