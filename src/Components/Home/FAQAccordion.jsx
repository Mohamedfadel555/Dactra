import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoIosAdd, IoIosRemove } from "react-icons/io";

export default function FAQAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleItem = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-6xl min-h-[400px] mx-auto columns-1 md:columns-2 gap-4 space-y-4">
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="break-inside-avoid bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        >
          <button
            onClick={() => toggleItem(index)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div
                className={`h-[2px] w-8 transition-colors ${
                  openIndex === index ? "bg-[#316BE8]" : "bg-gray-300"
                }`}
              />
              <h3 className="text-lg font-semibold text-[#3D3D3D]">
                {item.question}
              </h3>
            </div>
            <motion.div
              animate={{ rotate: openIndex === index ? 45 : 0 }}
              transition={{ duration: 0.2 }}
              className="flex-shrink-0"
            >
              {openIndex === index ? (
                <IoIosRemove className="text-2xl text-[#316BE8]" />
              ) : (
                <IoIosAdd className="text-2xl text-gray-400" />
              )}
            </motion.div>
          </button>

          <AnimatePresence>
            {openIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 pl-14">
                  <p className="text-[#6D6D6D] text-base leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
}
