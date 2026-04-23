import { useState } from "react";
import { Field, ErrorMessage, Form, Formik } from "formik";
import { motion } from "framer-motion";
import { BiSolidEditAlt } from "react-icons/bi";
import { BsCameraVideo, BsPeopleFill } from "react-icons/bs";
import { RiErrorWarningLine } from "react-icons/ri";
import * as Yup from "yup";
import SubmitButton from "./../Auth/SubmitButton";
import { useSaveWorkDetails } from "../../hooks/useSaveWorkDetails";

// ─── Validation ───────────────────────────────────────────────────────────────

const workDetailsSchema = Yup.object({
  startTime: Yup.string().required("Required"),
  endTime: Yup.string().required("Required"),
  consultationDurationMinutes: Yup.number().required("Required"),
  consultationPrice: Yup.number().min(0, "Must be ≥ 0").required("Required"),
});

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypeTab({ active, onClick, Icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-xl border cursor-pointer transition-colors
        ${
          active
            ? "bg-blue-50 text-blue-700 border-blue-400"
            : "bg-[#F5F6F7] text-[#6D7379] border-[#BBC1C7] hover:bg-gray-100"
        }`}
    >
      <Icon className="text-[15px]" />
      {label}
    </button>
  );
}

function MissingDetailsWarning() {
  return (
    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
      <RiErrorWarningLine className="text-amber-500 text-lg shrink-0" />
      <p className="text-sm text-amber-700">
        Fill in the details to display available time slots for booking.
      </p>
    </div>
  );
}

function TypeForm({ type, details, editable, onSave }) {
  const isEmpty =
    !details?.startTime && !details?.endTime && !details?.consultationPrice;

  const saveWorkDetailsMutation = useSaveWorkDetails();

  const saveWorkDetails = async (values) => {
    await saveWorkDetailsMutation.mutateAsync(values);
  };

  return (
    <div className="flex flex-col gap-3">
      {isEmpty && <MissingDetailsWarning />}

      <Formik
        enableReinitialize
        validationSchema={workDetailsSchema}
        initialValues={{
          startTime: details?.workingStartTime?.slice(0, 5) || "",
          endTime: details?.workingEndTime?.slice(0, 5) || "",
          consultationDurationMinutes:
            details?.consultationDurationMinutes || "",
          consultationPrice: details?.consultationPrice || "",
        }}
        onSubmit={async (values, { setSubmitting }) => {
          await saveWorkDetails({
            type: type === "online" ? 1 : 0,
            workingStartTime: values.startTime,
            workingEndTime: values.endTime,
            consultationDurationMinutes: values.consultationDurationMinutes,
            consultationPrice: values.consultationPrice,
          });
          setSubmitting(false);
        }}
      >
        {({ isValid, dirty, isSubmitting }) => (
          <Form className="flex flex-col">
            <table className="w-full border-separate border-spacing-y-3">
              <tbody>
                {/* Start Time */}
                <tr className="bg-gray-50 rounded-lg">
                  <td className="w-1/3 font-medium py-3 px-4 text-sm">
                    Start Time
                  </td>
                  <td className="py-3 px-4">
                    <Field
                      name="startTime"
                      readOnly={!editable}
                      type="time"
                      className={`w-full focus:outline-none rounded px-2 py-1 text-sm
                        ${editable ? "bg-white" : "bg-gray-50"}`}
                    />
                    {editable && (
                      <ErrorMessage
                        name="startTime"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    )}
                  </td>
                </tr>

                {/* End Time */}
                <tr className="bg-gray-50 rounded-lg">
                  <td className="font-medium py-3 px-4 text-sm">End Time</td>
                  <td className="py-3 px-4">
                    <Field
                      name="endTime"
                      readOnly={!editable}
                      type="time"
                      className={`w-full focus:outline-none rounded px-2 py-1 text-sm
                        ${editable ? "bg-white" : "bg-gray-50"}`}
                    />
                    {editable && (
                      <ErrorMessage
                        name="endTime"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    )}
                  </td>
                </tr>

                {/* Duration */}
                <tr className="bg-gray-50 rounded-lg">
                  <td className="font-medium py-3 px-4 text-sm">Duration</td>
                  <td className="py-3 px-4">
                    <Field
                      name="consultationDurationMinutes"
                      as="select"
                      readOnly={!editable}
                      className={`w-full focus:outline-none rounded px-2 py-1 text-sm
                        ${
                          editable
                            ? "bg-white cursor-pointer"
                            : "cursor-default appearance-none bg-gray-50"
                        }`}
                    >
                      <option value="">Select Duration</option>
                      <option value="30">30 min</option>
                      <option value="45">45 min</option>
                      <option value="60">60 min</option>
                    </Field>
                    {editable && (
                      <ErrorMessage
                        name="consultationDurationMinutes"
                        component="div"
                        className="text-red-500 text-xs mt-1"
                      />
                    )}
                  </td>
                </tr>

                {/* Price */}
                <tr className="bg-gray-50 rounded-lg">
                  <td className="font-medium py-3 px-4 text-sm">Price</td>
                  <td className="py-3 px-4 flex justify-between items-center pr-5">
                    <div>
                      <Field
                        name="consultationPrice"
                        readOnly={!editable}
                        type="number"
                        className={`focus:outline-none rounded px-2 py-1 w-[100px] sm:w-[150px] text-sm
                          [&::-webkit-inner-spin-button]:appearance-none
                          [&::-webkit-outer-spin-button]:appearance-none
                          ${editable ? "bg-white cursor-text" : "cursor-default"}`}
                      />
                      {editable && (
                        <ErrorMessage
                          name="consultationPrice"
                          component="div"
                          className="text-red-500 text-xs mt-1"
                        />
                      )}
                    </div>
                    <span className="text-sm text-[#6D7379]">LE</span>
                  </td>
                </tr>
              </tbody>
            </table>

            {editable && (
              <SubmitButton
                text="Save"
                disabled={!isValid || !dirty}
                isLoading={isSubmitting}
                loadingText="Saving..."
                className="h-[40px] w-full sm:w-[120px] bg-blue-600 self-end mt-1"
              />
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
/**
 * Props:
 *   workingDetails: {
 *     inPerson: { workingStartTime, workingEndTime, consultationDurationMinutes, consultationPrice } | null,
 *     online:   { workingStartTime, workingEndTime, consultationDurationMinutes, consultationPrice } | null,
 *   }
 *   saveWorkDetails: async ({type: "in-person"|"online", values}) => void
 *   rightItem: framer-motion variant
 */
export default function WorkDetailsCard({
  workingDetails = { inPerson: null, online: null },
  saveWorkDetails,
  rightItem,
}) {
  const [editable, setEditable] = useState(false);
  const [activeType, setActiveType] = useState("in-person");

  const details =
    activeType === "in-person"
      ? workingDetails.inPerson
      : workingDetails.online;

  return (
    <motion.div
      variants={rightItem}
      whileHover={{ y: -6 }}
      className="w-full bg-white shadow-md rounded-xl p-4 md:p-5"
    >
      <div className="flex flex-col gap-3">
        {/* header */}
        <div className="flex justify-between items-center">
          <p className="text-[20px] font-bold">Work Details</p>
          <BiSolidEditAlt
            className="text-blue-600 text-[25px] cursor-pointer"
            onClick={() => setEditable((p) => !p)}
          />
        </div>

        {/* type tabs */}
        <div className="flex gap-3">
          <TypeTab
            active={activeType === "in-person"}
            onClick={() => setActiveType("in-person")}
            Icon={BsPeopleFill}
            label="In-person"
          />
          <TypeTab
            active={activeType === "online"}
            onClick={() => setActiveType("online")}
            Icon={BsCameraVideo}
            label="Online"
          />
        </div>

        {/* form — re-mounts on type switch so Formik reinitialises cleanly */}
        <TypeForm
          key={activeType}
          type={activeType}
          details={details}
          editable={editable}
          onSave={saveWorkDetails}
        />
      </div>
    </motion.div>
  );
}
