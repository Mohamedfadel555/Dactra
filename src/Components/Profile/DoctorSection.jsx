import { FaGraduationCap } from "react-icons/fa6";
import { PiCertificate } from "react-icons/pi";
import { RiMedalLine, RiLoader4Line } from "react-icons/ri";
import { IoWarningOutline } from "react-icons/io5";
import { IoTrashOutline } from "react-icons/io5";
import { useState } from "react";
import { Field, Form, Formik } from "formik";
import {
  experienceInitialValues,
  qualificationsInitialValues,
} from "../../utils/formInitialValues";
import {
  experienceValidationSchema,
  qualificationsValidationSchema,
} from "../../utils/validationSchemas";
import { BiSolidEditAlt } from "react-icons/bi";
import { AnimatePresence, motion } from "framer-motion";
import { useAddQualifications } from "../../hooks/useAddQualifications";
import SubmitButton from "../Auth/SubmitButton";
import { useDeleteQualification } from "../../hooks/useDeleteQualification";

export default function DoctorSection({ title, info }) {
  const [form, setForm] = useState(false);
  const [loading, setLoading] = useState(null);
  const useQualificationMutation = useAddQualifications();
  const useDeleteQualificationMutation = useDeleteQualification();

  const QualificationSubmit = async (values, { resetForm }) => {
    try {
      await useQualificationMutation.mutateAsync(values);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const QualificationDelete = async (id) => {
    setLoading(id);
    try {
      await useDeleteQualificationMutation.mutateAsync(id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(null);
    }
  };

  const qualifiactionsOptions = [
    { value: "", label: "Select Qualification" },
    { value: "Bachelor", label: "Bachelor's Degree" },
    { value: "Master", label: "Master's Degree" },
    { value: "Doctorate", label: "Doctorate (PHD)" },
    { value: "Diploma", label: "Diploma" },
    { value: "Fellowship", label: "Fellowship" },
    { value: "Board", label: "Board" },
  ];

  // Framer variants
  const container = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06,
      },
    },
    exit: {},
  };

  const item = {
    hidden: { opacity: 0, x: 18, scale: 0.99 },
    show: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.36, ease: "easeOut" },
    },
    exit: { opacity: 0, x: -12, transition: { duration: 0.18 } },
  };

  const formVariant = {
    hidden: { opacity: 0, y: -8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.28 } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.18 } },
  };

  return (
    <div className="w-full bg-white shadow-md flex flex-col  gap-[20px] rounded-xl p-4 md:p-5">
      <div className="flex gap-[10px] justify-between items-center ">
        <p className="text-[20px] font-bold  ">{title}</p>
        <motion.div whileTap={{ scale: 0.94 }} whileHover={{ scale: 1.06 }}>
          <BiSolidEditAlt
            className="text-blue-600 text-[25px] cursor-pointer"
            onClick={() => setForm((prev) => !prev)}
          />
        </motion.div>
      </div>

      <div className="px-[20px] flex flex-col gap-[10px] ">
        <AnimatePresence initial={false}>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {info && info.length !== 0 ? (
              info.map((inf) => (
                <motion.div
                  key={inf.id}
                  variants={item}
                  whileHover={{ scale: 1.01, x: 6 }}
                  whileTap={{ scale: 0.985 }}
                  className="w-full flex justify-between items-center py-2"
                >
                  <div className="flex  items-center gap-[20px]">
                    {inf.type === "Bachelor" ? (
                      <FaGraduationCap className="shrink-0 text-[28px] text-blue-600  " />
                    ) : inf.type === "Master" ||
                      inf.type === "Diploma" ||
                      inf.type === "Doctorate" ? (
                      <PiCertificate className="text-[28px] shrink-0 text-blue-600  " />
                    ) : inf.type === "Fellowship" || inf.type === "Board" ? (
                      <RiMedalLine className="text-[28px] shrink-0 text-blue-600  " />
                    ) : null}
                    <span className="break-words">{inf.description}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {form && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                      >
                        {loading === inf.id ? (
                          <RiLoader4Line className="text-red-500 text-[20px] animate-spin" />
                        ) : (
                          <motion.button
                            whileHover={{ rotate: 8, scale: 1.06 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => QualificationDelete(inf.id)}
                            className="text-red-500 cursor-pointer text-[20px]"
                            aria-label={`Delete qualification ${inf.id}`}
                          >
                            <IoTrashOutline />
                          </motion.button>
                        )}
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={item}
                className="flex  items-center gap-[20px]"
                initial="hidden"
                animate="show"
              >
                <IoWarningOutline className="text-[40px] animate-bounce  text-blue-600" />
                <div className="text-sm text-[#445]">
                  {title === "Qualifications"
                    ? "Adding your qualifiactions helps build greater trust with patients and enhances your profile credibility"
                    : title === "Experience"
                    ? "Add your experience to help patients make informed desicions with confidence"
                    : null}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {form && (
            <motion.div
              variants={formVariant}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <Formik
                onSubmit={
                  title === "Qualifications" ? QualificationSubmit : null
                }
                initialValues={
                  title === "Qualifications"
                    ? qualificationsInitialValues
                    : experienceInitialValues
                }
                validationSchema={
                  title === "Qualifications"
                    ? qualificationsValidationSchema
                    : experienceValidationSchema
                }
              >
                {({ errors, touched, isValid, dirty, isSubmitting }) => (
                  <Form className="flex flex-col sm:flex-row sm:items-start min-h-[80px] items-end flex-wrap gap-4 mt-[18px]">
                    {title === "Qualifications" ? (
                      <>
                        <div className="flex flex-col w-full sm:w-[150px]">
                          <label htmlFor="type">Type</label>
                          <Field
                            name="type"
                            id="type"
                            as="select"
                            className="border px-1.5 py-1 rounded"
                          >
                            {qualifiactionsOptions.map((q) => (
                              <option key={q.value} value={q.value}>
                                {q.label}
                              </option>
                            ))}
                          </Field>
                          {errors.type && touched.type && (
                            <span className="text-red-500 text-sm">
                              {errors.type}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col w-full sm:w-[150px]">
                          <label htmlFor="description">Description</label>
                          <Field
                            name="description"
                            id="description"
                            className="border px-3 py-2 rounded"
                          />
                          {errors.description && touched.description && (
                            <span className="text-red-500 text-sm">
                              {errors.description}
                            </span>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex flex-col w-full sm:w-[150px]">
                          <label htmlFor="content">Content</label>
                          <Field
                            name="content"
                            id="content"
                            className="border px-3 py-2 rounded"
                          />
                          {errors.content && touched.content && (
                            <span className="text-red-500 text-sm">
                              {errors.content}
                            </span>
                          )}
                        </div>
                      </>
                    )}

                    <motion.div
                      whileHover={{ y: -3 }}
                      transition={{ type: "spring", stiffness: 260 }}
                    >
                      <SubmitButton
                        fullWidth={false}
                        disabled={!isValid || !dirty}
                        isLoading={isSubmitting}
                        loadingText="Adding"
                        className="mt-[23px]! h-[40px] w-full sm:w-[120px] bg-blue-600 "
                        text="Add"
                      />
                    </motion.div>
                  </Form>
                )}
              </Formik>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
