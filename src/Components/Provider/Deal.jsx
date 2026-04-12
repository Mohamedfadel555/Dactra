import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  MdClose,
  MdSend,
  MdPercent,
  MdInfo,
  MdCheckCircle,
} from "react-icons/md";

/**
 * Deal Modal
 * Props:
 *   doctor   – { _id, name, specialization }
 *   onClose  – () => void
 *   onSubmit – (payload) => Promise<void>
 */
export function Deal({ doctor, onClose, onSubmit }) {
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const initials = doctor?.name
    ? doctor.name
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0])
        .join("")
    : "DR";

  const formik = useFormik({
    initialValues: {
      discount: "",
      description: "",
      startDate: "",
      endDate: "",
    },
    validationSchema: Yup.object({
      discount: Yup.number()
        .typeError("Enter a valid number")
        .min(1, "Minimum discount is 1%")
        .max(100, "Maximum discount is 100%")
        .required("Discount is required"),
      description: Yup.string()
        .trim()
        .required("Please enter a deal description"),
      startDate: Yup.date().nullable().notRequired(),
      endDate: Yup.date()
        .nullable()
        .notRequired()
        .when("startDate", (startDate, schema) =>
          startDate?.[0]
            ? schema.min(startDate[0], "End date must be after start date")
            : schema,
        ),
    }),
    onSubmit: async (values) => {
      await onSubmit({
        doctorId: doctor._id,
        discount: Number(values.discount),
        description: values.description,
        startDate: values.startDate || null,
        endDate: values.endDate || null,
      });
      setSuccess(true);
      setTimeout(onClose, 2000);
    },
  });

  const hasError = (name) => formik.touched[name] && formik.errors[name];

  const inputClass = (name) =>
    `w-full px-3.5 py-2.5 text-sm rounded-xl border outline-none transition-all ${
      hasError(name)
        ? "border-red-400 bg-red-50 focus:ring-2 focus:ring-red-200"
        : "border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
    }`;

  return (
    <AnimatePresence>
      {/* ── Backdrop ── */}
      <motion.div
        key="deal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end justify-center sm:items-center sm:p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* ── Card ── */}
        <motion.div
          key="deal-card"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", stiffness: 340, damping: 28 }}
          className="
            w-full bg-white shadow-2xl overflow-hidden flex flex-col
            rounded-t-3xl max-h-[92dvh]
            sm:rounded-2xl sm:max-w-[440px] sm:max-h-[90vh]
          "
        >
          {/* ── SUCCESS ── */}
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center gap-4 px-8 py-14 text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 18,
                  delay: 0.08,
                }}
                className="relative w-[72px] h-[72px]"
              >
                <motion.span
                  className="absolute inset-0 rounded-full bg-green-400/20"
                  animate={{ scale: [1, 2.2], opacity: [0.5, 0] }}
                  transition={{
                    duration: 1.1,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                />
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <MdCheckCircle size={32} color="#fff" />
                </div>
              </motion.div>
              <p className="text-lg font-semibold text-gray-900">Deal Sent!</p>
              <p className="text-sm text-gray-500 leading-relaxed">
                Your offer has been sent to <strong>{doctor?.name}</strong>.
                <br />
                You'll be notified once they respond.
              </p>
            </motion.div>
          ) : (
            <>
              {/* drag handle — mobile only */}
              <div className="flex justify-center pt-3 pb-0 sm:hidden shrink-0">
                <div className="w-10 h-1 rounded-full bg-gray-200" />
              </div>

              {/* ── Header ── */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-sm font-bold text-blue-700 shrink-0">
                    {initials}
                  </div>
                  <div>
                    <p className="text-[15px] font-semibold text-gray-900 leading-tight">
                      Make a Deal
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {doctor?.name} · {doctor?.specialization || "Specialist"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
                >
                  <MdClose size={18} />
                </button>
              </div>

              {/* ── Fields (scrollable) ── */}
              <div className="px-5 py-4 flex flex-col gap-4 overflow-y-auto flex-1">
                {/* Discount */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                    Discount Percentage <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      placeholder="e.g. 20"
                      {...formik.getFieldProps("discount")}
                      className={`${inputClass("discount")} flex-1`}
                    />
                    <div className="w-[42px] h-[42px] rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <MdPercent size={17} className="text-blue-500" />
                    </div>
                  </div>
                  <AnimatePresence>
                    {hasError("discount") && (
                      <motion.p
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-red-500 mt-1.5"
                      >
                        {formik.errors.discount}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                    Deal Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder={`e.g. ${formik.values.discount || "20"}% off all blood tests for Dr. ${doctor?.name?.split(" ")[0] || "Smith"}'s patients...`}
                    {...formik.getFieldProps("description")}
                    className={`${inputClass("description")} resize-none leading-relaxed`}
                  />
                  <AnimatePresence>
                    {hasError("description") && (
                      <motion.p
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-red-500 mt-1.5"
                      >
                        {formik.errors.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Dates */}

                {/* Info note */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-2.5 items-start bg-sky-50 border border-sky-200 rounded-xl px-3.5 py-2.5"
                >
                  <MdInfo size={15} className="text-sky-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-sky-700 leading-relaxed">
                    A request will be sent to the doctor for approval. Once
                    accepted, their patients will automatically receive this
                    discount.
                  </p>
                </motion.div>
              </div>

              {/* ── Footer ── */}
              <div className="flex gap-2.5 px-5 py-4 border-t border-gray-100 shrink-0">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <motion.button
                  type="button"
                  whileHover={{ y: -1 }}
                  whileTap={{ y: 1 }}
                  onClick={formik.handleSubmit}
                  disabled={formik.isSubmitting}
                  className="flex-[2] py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(37,99,235,.3)] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                >
                  {formik.isSubmitting ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 0.7,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <MdSend size={14} />
                      Send Offer to Doctor
                    </>
                  )}
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
