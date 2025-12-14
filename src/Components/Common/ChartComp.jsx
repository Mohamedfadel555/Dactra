import React, { useState } from "react";
import { MdAddChart } from "react-icons/md";
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

export default function ChartComp({ data, title, domain, fields, onAdd }) {
  const [showForm, setShowForm] = useState(false);

  const validationsch = yup.object(
    fields.reduce((acc, field) => {
      acc[field.key] = yup
        .number()
        .min(field.min, "Too low")
        .max(field.max, "Too high")
        .required("required");
      return acc;
    }, {})
  );

  return (
    <div className="duration-700 w-full flex flex-col gap-4 bg-white shadow-md rounded-xl p-5">
      <div className=" mb-[10px] flex w-full justify-between items-center">
        <p className=" text-lg font-semibold">{title}</p>
        <MdAddChart
          onClick={() => setShowForm((prev) => !prev)}
          className="text-[25px] cursor-pointer text-blue-600"
        />
      </div>

      {/* Chart */}
      <div className="w-full h-[300px] sm:h-[340px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              className="whitespace-pre-line! "
            />
            <YAxis domain={domain} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {fields.map((field) => (
              <Line
                key={field.key}
                type="monotone"
                dataKey={field.key}
                name={field.label}
                stroke={field.color}
                strokeWidth={3}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Formik
              initialValues={fields.reduce(
                (acc, field) => ({ ...acc, [field.key]: "" }),
                {}
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
                <Form className="flex flex-col sm:flex-row sm:items-start min-h-[100px] items-end flex-wrap gap-4 mt-[20px]">
                  {fields.map((field) => (
                    <div
                      key={field.key}
                      className="flex flex-col w-full sm:w-[150px]"
                    >
                      <label
                        htmlFor={field.key}
                        className="text-sm font-medium"
                      >
                        {field.label}
                      </label>
                      <Field
                        id={field.key}
                        name={field.key}
                        type="number"
                        className="border px-3 py-2 rounded"
                      />
                      {errors[field.key] && touched[field.key] && (
                        <span className="text-red-500 text-sm">
                          {errors[field.key]}
                        </span>
                      )}
                    </div>
                  ))}

                  <SubmitButton
                    fullWidth={false}
                    className="mt-[19px]! px-[20px]!"
                    text="Add"
                    loadingText="Adding"
                    disabled={!isValid && !dirty}
                    isLoading={isSubmitting}
                  />
                </Form>
              )}
            </Formik>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
