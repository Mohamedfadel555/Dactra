import { useState } from "react";
import { MdAddChart } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import * as yup from "yup";
import { Formik, Form, Field } from "formik";
import { motion, AnimatePresence } from "framer-motion";
import SubmitButton from "../Auth/SubmitButton";

// ─── custom tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-[12px]">
      <p className="text-gray-400 mb-2 font-medium">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span
            className="inline-block size-2 rounded-full flex-shrink-0"
            style={{ background: p.color }}
          />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-semibold text-gray-900">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

// ─── component ────────────────────────────────────────────────────────────────

export default function ChartComp({
  data,
  title,
  domain,
  fields,
  onAdd,
  editFlag = true,
}) {
  const [showForm, setShowForm] = useState(false);

  const validationsch = yup.object(
    fields.reduce((acc, field) => {
      acc[field.key] = yup
        .number()
        .min(field.min, `Min ${field.min}`)
        .max(field.max, `Max ${field.max}`)
        .required("Required");
      return acc;
    }, {}),
  );

  const isEmpty = !data || data.length === 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      {/* ── header ── */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-[16px] font-bold text-gray-900">{title}</p>
          {isEmpty && (
            <p className="text-[12px] text-gray-400 mt-0.5">No data yet</p>
          )}
        </div>
        {editFlag && (
          <motion.button
            onClick={() => setShowForm((p) => !p)}
            whileHover={{ y: -1, boxShadow: "0 6px 20px rgba(24,95,165,.2)" }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold transition-colors ${
              showForm
                ? "bg-gray-100 text-gray-600"
                : "bg-blue-600 text-white shadow-md shadow-blue-200/60"
            }`}
          >
            {showForm ? (
              <>
                <IoCloseSharp size={14} /> Cancel
              </>
            ) : (
              <>
                <MdAddChart size={15} /> Add reading
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* ── chart ── */}
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f0f0f0"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={domain}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
            />
            {fields.map((field) => (
              <Line
                key={field.key}
                type="monotone"
                dataKey={field.key}
                name={field.label}
                stroke={field.color}
                strokeWidth={2.5}
                dot={{ r: 3, strokeWidth: 0, fill: field.color }}
                activeDot={{ r: 5, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── add-reading form ── */}
      {editFlag && (
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-5 pt-5 border-t border-gray-100">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  New reading
                </p>
                <Formik
                  initialValues={fields.reduce(
                    (acc, field) => ({ ...acc, [field.key]: "" }),
                    {},
                  )}
                  validationSchema={validationsch}
                  onSubmit={async (values, { resetForm }) => {
                    await onAdd({
                      ...values,
                      vitalSignTypeId:
                        title === "Blood Pressure"
                          ? 1
                          : title === "Heart Rate"
                            ? 2
                            : 3,
                    });
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  {({ errors, touched, isValid, dirty, isSubmitting }) => (
                    <Form className="flex flex-wrap items-end gap-3">
                      {fields.map((field) => (
                        <div
                          key={field.key}
                          className="flex flex-col gap-1.5 flex-1 min-w-[120px]"
                        >
                          <label
                            htmlFor={field.key}
                            className="text-[12px] font-semibold text-gray-600"
                          >
                            {field.label}
                          </label>
                          <div className="relative">
                            <Field
                              id={field.key}
                              name={field.key}
                              type="number"
                              placeholder={`${field.min}–${field.max}`}
                              className={`w-full border rounded-xl px-3 py-2.5 text-[13px] outline-none transition-colors
                                ${
                                  errors[field.key] && touched[field.key]
                                    ? "border-red-300 bg-red-50 focus:border-red-400"
                                    : "border-gray-200 bg-gray-50 focus:border-blue-400 focus:bg-white"
                                }`}
                            />
                            {/* color dot accent */}
                            <span
                              className="absolute right-3 top-1/2 -translate-y-1/2 size-2 rounded-full"
                              style={{ background: field.color }}
                            />
                          </div>
                          {errors[field.key] && touched[field.key] && (
                            <span className="text-[11px] text-red-500">
                              {errors[field.key]}
                            </span>
                          )}
                        </div>
                      ))}

                      <SubmitButton
                        fullWidth={false}
                        className="px-5! py-2.5! rounded-xl! text-[13px]! font-semibold!"
                        text="Save"
                        loadingText="Saving"
                        disabled={!isValid || !dirty}
                        isLoading={isSubmitting}
                      />
                    </Form>
                  )}
                </Formik>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
