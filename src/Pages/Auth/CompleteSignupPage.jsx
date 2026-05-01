import { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "../../Components/Common/BrandLogo";
import FormInputField from "../../Components/Auth/FormInputField";
import SubmitButton from "../../Components/Auth/SubmitButton";
import { USER_TYPE_IMAGES } from "../../constants/authConstants";
import { getCompleteSignupValidationSchema } from "../../utils/validationSchemas";
import { getCompleteSignupInitialValues } from "../../utils/formInitialValues";
import { useCompleteSignup } from "../../hooks/useCompleteSignup";
import {
  MdPerson,
  MdPersonOutline,
  MdMale,
  MdCalendarToday,
  MdStraighten,
  MdMonitorWeight,
  MdSmokingRooms,
  MdFavoriteBorder,
  MdLocalHospital,
  MdScience,
  MdWorkHistory,
  MdHomeWork,
  MdBadge,
  MdInfoOutline,
} from "react-icons/md";
import {
  FaTint,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaIdCard,
  FaBuilding,
} from "react-icons/fa";
import { useMajors } from "../../hooks/useMajors";
import { useGetAllAllergiesForSignup } from "../../hooks/useGetAllAllergiesForSignup";
import { useGetAllChronicForSignup } from "../../hooks/useGetAllChronicForSignup";
import {
  buildWorkingRowsFromApi,
  rowsToWorkingHourPayload,
  DAY_LABELS_AR_EN,
} from "../../utils/workingHours";

function normalizeSignupUserTypeKey(raw) {
  let k = String(raw || "").toLowerCase();
  if (k === "lab") k = "lap";
  if (USER_TYPE_IMAGES[k]) return k;
  let fromLs = String(
    localStorage.getItem("pendingSignupUserType") || "",
  ).toLowerCase();
  if (fromLs === "lab") fromLs = "lap";
  if (USER_TYPE_IMAGES[fromLs]) return fromLs;
  return "patient";
}

export default function CompleteSignupPage() {
  const { state } = useLocation();
  const email = state?.email || "";
  const initialUserType =
    state?.userType ||
    localStorage.getItem("pendingSignupUserType") ||
    "patient";
  const navigate = useNavigate();
  const [userType] = useState(() =>
    normalizeSignupUserTypeKey(initialUserType),
  );
  const completeSignupMutation = useCompleteSignup(userType);
  // const [majors, setMajors] = useState([]);
  // const [majorsLoading, setMajorsLoading] = useState(false);
  // const [majorsError, setMajorsError] = useState("");

  const {
    data: majors,
    isLoading: majorsLoading,
    isError: majorsError,
  } = useMajors(userType);

  const {
    data: allergies = [],
    isLoading: allergiesLoading,
  } = useGetAllAllergiesForSignup();

  const {
    data: chronicDiseases = [],
    isLoading: chronicDiseasesLoading,
  } = useGetAllChronicForSignup();

  const userTypeNorm = String(userType || "").toLowerCase();
  const isProvider =
    userTypeNorm === "scan" ||
    userTypeNorm === "lab" ||
    userTypeNorm === "lap" ||
    userTypeNorm === "medicaltestsprovider" ||
    userTypeNorm === "medicaltestprovider" ||
    userTypeNorm === "provider";
  const [workingRows, setWorkingRows] = useState(() => buildWorkingRowsFromApi([]));
  const [quickFrom, setQuickFrom] = useState("09:00");
  const [quickTo, setQuickTo] = useState("17:00");

  useEffect(() => {
    if (!email) {
      navigate("/auth/Signup", { replace: true });
    }
  }, [email, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const payload = buildPayload({
      email,
      userType,
      values,
      workingRows,
    });
    console.log("Complete signup data being sent:", payload);
    try {
      await completeSignupMutation.mutateAsync(payload);
      localStorage.removeItem("pendingSignupUserType");
      navigate("/auth/Login");
    } catch (error) {
      console.error("Complete signup error:", error);
      console.error("Server response:", error.response?.data);
      const errs = error?.response?.data?.errors;
      if (errs && typeof errs === "object") {
        const lines = Object.entries(errs).flatMap(([k, v]) => {
          const arr = Array.isArray(v) ? v : [String(v)];
          return arr.map((msg) => `${k}: ${msg}`);
        });
        if (lines.length) console.error("Validation errors:", lines);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-[20px] py-[10px] px-[40px]">
      <div className="w-full flex-1 flex-col md:flex-row flex justify-center items-center gap-[30px]">
        {/* Left Section - Image (same style as Signup) */}
        <div className="flex justify-center items-center w-1/2">
          <AnimatePresence mode="wait">
            <motion.img
              loading="lazy"
              key={userType}
              src={USER_TYPE_IMAGES[userType]}
              alt={`${userType} Complete SignUp Image`}
              className="max-w-[90%] min-w-[250px]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
        </div>

        {/* Right Section - Form card (same style as Signup) */}
        <div className="min-w-[280px] w-[95%] md:w-1/2 flex justify-center items-center">
          <div className="w-full h-[500px] md:h-[550px] bg-[#FFFFFF] rounded-[25px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] flex flex-col pt-[20px] items-center gap-[20px] overflow-hidden">
            {/* Brand Logo */}
            <BrandLogo />

            {/* Scrollable Form Container */}
            <div className="flex-1 w-[90%] md:w-2/3 overflow-y-auto overflow-x-hidden pr-[5px] custom-scrollbar min-h-0 pb-[20px]">
              <Formik
                initialValues={getCompleteSignupInitialValues(userType)}
                validationSchema={getCompleteSignupValidationSchema(userType)}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, isValid, dirty }) => {
                  const isDoctor = userType === "doctor";
                  const disableSubmit =
                    !isValid ||
                    !dirty ||
                    (isDoctor && (majorsLoading || majors.length === 0));

                  return (
                    <Form className="w-full flex flex-col gap-[20px] pb-[10px]">
                      <div className="flex flex-col gap-[10px]">
                        {renderFieldsByUserType(
                          userType,
                          majors,
                          majorsLoading,
                          majorsError,
                          allergies,
                          allergiesLoading,
                          chronicDiseases,
                          chronicDiseasesLoading,
                          isProvider
                            ? {
                                rows: workingRows,
                                quickFrom,
                                quickTo,
                                setQuickFrom,
                                setQuickTo,
                                handleRowChange: (day, field, value) =>
                                  setWorkingRows((prev) =>
                                    prev.map((r) =>
                                      r.day === day ? { ...r, [field]: value } : r,
                                    ),
                                  ),
                                applyQuickToAllDays: () =>
                                  setWorkingRows((prev) =>
                                    prev.map((r) => ({ ...r, from: quickFrom, to: quickTo })),
                                  ),
                              }
                            : null
                        )}
                      </div>

                      {/* Submit */}
                      <div className="w-full flex flex-col gap-[10px] justify-center items-center pb-[10px]">
                        <SubmitButton
                          text="Sign Up"
                          loadingText="Saving..."
                          isLoading={
                            isSubmitting || completeSignupMutation.isPending
                          }
                          disabled={disableSubmit}
                        />
                        {isDoctor && majorsError && (
                          <p className="text-sm text-red-500 text-center">
                            {majorsError}
                          </p>
                        )}
                      </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderFieldsByUserType(
  userType,
  majors,
  majorsLoading,
  majorsError,
  allergies = [],
  allergiesLoading = false,
  chronicDiseases = [],
  chronicDiseasesLoading = false,
  providerHours
) {
  if (userType === "patient") {
    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
          <FormInputField
            name="firstName"
            label="First Name"
            placeholder="Enter first name"
            icon={MdPerson}
          />
          <FormInputField
            name="lastName"
            label="Last Name"
            placeholder="Enter last name"
            icon={MdPersonOutline}
          />
        </div>
        <FormInputField
          name="gender"
          label="Gender"
          type="select"
          placeholder="Select gender"
          options={[
            { value: "0", label: "Male" },
            { value: "1", label: "Female" },
          ]}
          icon={MdMale}
        />
        <FormInputField
          name="dateOfBirth"
          label="Date of Birth"
          type="date"
          icon={MdCalendarToday}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
          <FormInputField
            name="height"
            label="Height (cm)"
            type="number"
            placeholder="Enter height"
            icon={MdStraighten}
          />
          <FormInputField
            name="weight"
            label="Weight (kg)"
            type="number"
            placeholder="Enter weight"
            icon={MdMonitorWeight}
          />
        </div>
        <FormInputField
          name="bloodType"
          label="Blood Type"
          type="select"
          placeholder="Select blood type"
          options={[
            { value: "0", label: "A+" },
            { value: "1", label: "A-" },
            { value: "2", label: "B+" },
            { value: "3", label: "B-" },
            { value: "4", label: "AB+" },
            { value: "5", label: "AB-" },
            { value: "6", label: "O+" },
            { value: "7", label: "O-" },
          ]}
          icon={FaTint}
        />
        <FormInputField
          name="smokingStatus"
          label="Smoking Status"
          type="select"
          placeholder="Select smoking status"
          options={[
            { value: "0", label: "Non-smoker" },
            { value: "1", label: "Smoker" },
            { value: "2", label: "Former" },
          ]}
          icon={MdSmokingRooms}
        />
        <FormInputField
          name="maritalStatus"
          label="Marital Status"
          type="select"
          placeholder="Select marital status"
          options={[
            { value: "0", label: "Single" },
            { value: "1", label: "Married" },
            { value: "2", label: "Divorced" },
            { value: "3", label: "Widowed" },
          ]}
          icon={MdFavoriteBorder}
        />
        <FormInputField
          name="chronicDisease"
          label="Chronic Diseases"
          type="select"
          placeholder={chronicDiseasesLoading ? "Loading..." : "Select chronic disease (optional)"}
          options={[
            { value: "", label: "None" },
            ...chronicDiseases.map((disease) => ({
              value: String(disease.id),
              label: disease.name,
            })),
          ]}
          icon={MdLocalHospital}
        />
        <FormInputField
          name="allergies"
          label="Allergies"
          type="select"
          placeholder={allergiesLoading ? "Loading..." : "Select allergy (optional)"}
          options={[
            { value: "", label: "None" },
            ...allergies.map((allergy) => ({
              value: String(allergy.id),
              label: allergy.name,
            })),
          ]}
          icon={MdScience}
        />
      </>
    );
  }

  if (userType === "doctor") {
    const majorOptions = (majors || [])
      .filter((major) => major?.id !== undefined)
      .map((major) => ({
        value: String(major.id),
        label: major.name || `Major ${major.id}`,
      }));

    const majorPlaceholder = majorsLoading
      ? "Loading majors..."
      : majorOptions.length === 0
      ? "No majors available"
      : "Select a major";

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
          <FormInputField
            name="firstName"
            label="First Name"
            placeholder="Enter first name"
            icon={MdPerson}
          />
          <FormInputField
            name="lastName"
            label="Last Name"
            placeholder="Enter last name"
            icon={MdPersonOutline}
          />
        </div>
        <FormInputField
          name="gender"
          label="Gender"
          type="select"
          placeholder="Select gender"
          options={[
            { value: "0", label: "Male" },
            { value: "1", label: "Female" },
          ]}
          icon={MdMale}
        />
        <FormInputField
          name="dateOfBirth"
          label="Date of Birth"
          type="date"
          icon={MdCalendarToday}
        />
        <FormInputField
          name="careerStartDate"
          label="Career Start Date"
          type="date"
          icon={MdWorkHistory}
        />
        <FormInputField
          name="clinicAddress"
          label="Clinic Address"
          type="text"
          placeholder="Enter clinic address"
          icon={MdHomeWork}
        />
        <FormInputField
          name="licenseNumber"
          label="License Number"
          type="text"
          placeholder="Enter license number"
          icon={MdBadge}
        />
        {majorsLoading && (
          <p className="text-sm text-[#145DB8]">Loading majors...</p>
        )}
        {!majorsLoading && majors.length === 0 && !majorsError && (
          <p className="text-sm text-red-500">
            No majors available. Please contact support.
          </p>
        )}
        <FormInputField
          name="majorId"
          label="Major"
          placeholder={majorPlaceholder}
          // {majorloading ? "Loading majors..." : "Select a major"}
          type="select"
          options={majorOptions}
          icon={FaGraduationCap}
        />
      </>
    );
  }

  // For provider (lab/scan) we pass `providerHours`; show the section when it exists.
  return (
    <>
      <FormInputField
        name="displayName"
        label="Display Name"
        type="text"
        placeholder="Enter organization name"
        icon={FaBuilding}
      />
      <FormInputField
        name="address"
        label="Address"
        type="text"
        placeholder="Enter address"
        icon={FaMapMarkerAlt}
      />
      <FormInputField
        name="licenseNumber"
        label="License Number"
        type="text"
        placeholder="Enter license number"
        icon={FaIdCard}
      />
      <FormInputField
        name="about"
        label="About"
        type="text"
        placeholder="Describe your services"
        icon={MdInfoOutline}
      />
      {providerHours ? (
        <div className="mt-1 rounded-2xl border border-slate-100 bg-slate-50/60 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[13px] font-bold text-slate-800">Working hours</p>
            <button
              type="button"
              onClick={providerHours.applyQuickToAllDays}
              className="text-[12px] font-semibold text-[#316BE8] hover:underline"
              title="Apply to all days"
            >
              Apply to all
            </button>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <label className="text-[12px] font-medium text-slate-600 w-10">
                From
              </label>
              <input
                type="time"
                value={providerHours.quickFrom}
                onChange={(e) => providerHours.setQuickFrom(e.target.value)}
                className="flex-1 h-10 rounded-xl border border-slate-200 bg-white px-3 text-[13px] outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[12px] font-medium text-slate-600 w-10">
                To
              </label>
              <input
                type="time"
                value={providerHours.quickTo}
                onChange={(e) => providerHours.setQuickTo(e.target.value)}
                className="flex-1 h-10 rounded-xl border border-slate-200 bg-white px-3 text-[13px] outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div className="mt-3 space-y-2">
            {providerHours.rows.map((r) => (
              <div
                key={r.day}
                className="grid grid-cols-[86px_1fr_1fr] items-center gap-2"
              >
                <span className="text-[12px] font-semibold text-slate-700">
                  {DAY_LABELS_AR_EN[r.day]?.en ?? r.label}
                </span>
                <input
                  type="time"
                  value={r.from}
                  onChange={(e) => providerHours.handleRowChange(r.day, "from", e.target.value)}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-[13px] outline-none focus:ring-2 focus:ring-blue-200"
                />
                <input
                  type="time"
                  value={r.to}
                  onChange={(e) => providerHours.handleRowChange(r.day, "to", e.target.value)}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-[13px] outline-none focus:ring-2 focus:ring-blue-200"
                />
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </>
  );
}

function buildPayload({ email, userType, values, workingRows }) {
  if (userType === "patient") {
    const allergyIds =
      values.allergies && values.allergies !== ""
        ? [Number(values.allergies)]
        : [];
    const chronicDiseaseIds =
      values.chronicDisease && values.chronicDisease !== ""
        ? [Number(values.chronicDisease)]
        : [];
    return {
      email,
      role: userType,
      firstName: values.firstName,
      lastName: values.lastName,
      gender: Number(values.gender),
      dateOfBirth: values.dateOfBirth,
      height: Number(values.height),
      weight: Number(values.weight),
      bloodType: Number(values.bloodType),
      maritalStatus: Number(values.maritalStatus),
      smokingStatus: Number(values.smokingStatus),
      chronicDiseaseIds,
      allergyIds,
    };
  }

  if (userType === "doctor") {
    return {
      email,
      role: userType,
      firstName: values.firstName,
      lastName: values.lastName,
      gender: Number(values.gender),
      dateOfBirth: values.dateOfBirth,
      startingCareerDate: values.careerStartDate,
      licenceNo: values.licenseNumber,
      address: values.clinicAddress,
      majorId: Number(values.majorId),
    };
  }

  const ut = String(userType || "").toLowerCase();
  const providerRole = (() => {
    if (ut === "scan") return "Scan";
    if (ut === "lab" || ut === "lap") return "Lap";
    if (ut.includes("scan")) return "Scan";
    if (ut.includes("lab") || ut.includes("lap")) return "Lap";
    const pending = String(
      localStorage.getItem("pendingSignupUserType") || "",
    ).toLowerCase();
    if (pending === "scan") return "Scan";
    if (pending === "lab" || pending === "lap") return "Lap";
    return "Lap";
  })();
  const providerType = providerRole === "Scan" ? 1 : 0;
  const workinghours = rowsToWorkingHourPayload(workingRows || []);

  return {
    email,
    role: providerRole,
    type: providerType,
    name: values.displayName,
    licenceNo: values.licenseNumber,
    address: values.address,
    about: values.about,
    workinghours,
    workingHours: workinghours,
  };
}
