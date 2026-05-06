import {
  IoPersonSharp,
  IoTrashOutline,
  IoCloseSharp,
  IoWarning,
  IoWarningOutline,
} from "react-icons/io5";
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaRegEdit,
  FaFileMedicalAlt,
} from "react-icons/fa";
import ChartComp from "../../Components/Common/ChartComp";
import { useGetUser } from "../../hooks/useGetUser";
import { MdOutlinePassword } from "react-icons/md";
import profilePhoto from "../../assets/images/profile.webp";
import { useAuth } from "../../Context/AuthContext";
import BarComp from "../../Components/Common/BarComp";
import { useEffect, useRef, useState } from "react";
import AvatarIcon from "../../Components/Common/AvatarIcon1";
import { GiMedicines } from "react-icons/gi";
import { Form, Formik } from "formik";
import FormInputField from "../../Components/Auth/FormInputField";
import SubmitButton from "../../Components/Auth/SubmitButton";
import CommentCard from "../../Components/Common/CommentCard";
import { motion, AnimatePresence } from "framer-motion";
import { PiWarningCircle } from "react-icons/pi";
import {
  changePasswordValidationSchema,
  deleteAccValidationSchema,
  editDoctorProfileValidationSchema,
  editPatientProfileValidationSchema,
} from "../../utils/validationSchemas";
import { changePasswordInitialValues } from "../../utils/formInitialValues";
import { useCities } from "../../hooks/useCities";
import { useEditPatientProfile } from "../../hooks/useEditPatientProfile";
import { useChangePassword } from "../../hooks/useChangePassword";
import DoctorSection from "../../Components/Profile/DoctorSection";
import { useGetMyQualifications } from "../../hooks/useGetMyQualifications";
import { useDeleteMyAcc } from "../../hooks/useDeleteMyAcc";
import { useAddVitals } from "../../hooks/useAddVitals";
import { useGetVitals } from "../../hooks/useGetVitals";
import { useGetMyRatings } from "../../hooks/useGetMyRatings";
import SwiperComponent from "../../Components/Common/SwiperComponent";
import { useGetMyAllergies } from "../../hooks/useGetMyAllergies";
import { useGetMyChronic } from "../../hooks/useGetMyChronic";
import PatientSection from "../../Components/Profile/PatientSection";
import { useGetAllAllergies } from "../../hooks/useGetAllAllergies";
import { useGetAllChronic } from "../../hooks/useGetAllChronic";
import { useEditAllergies } from "../../hooks/useEditAllergies";
import { useEditChronics } from "../../hooks/useEditChronics";
import Schedule from "../../Components/Profile/Schedule";
import { useGetWorkingDetails } from "../../hooks/useGetWorkingDetails";
import { useSaveWorkDetails } from "../../hooks/useSaveWorkDetails";
import { useGetSlots } from "../../hooks/useGetSlots";
import WorkDetailsCard from "../../Components/Profile/WorkDetailsCard";
import {
  useCreateUserImage,
  useDeleteUserImage,
  useUpdateUserImage,
  useUserImage,
} from "../../hooks/useUserImage";
import { toast } from "react-toastify";
import { FaFileCirclePlus } from "react-icons/fa6";
import { useGetWeeklyApp } from "../../hooks/useGetWeeklyApp";
import { useLocation } from "react-router-dom";

// ─── static data ─────────────────────────────────────────────────────────────

const genderData = ["Male", "Female"];
const bloodTypeData = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const SmokingData = ["No", "Yes", "EX-Smoker"];
const martialData = ["Single", "Married", "Divorced", "Widowed"];

// ─── shared card wrapper ──────────────────────────────────────────────────────

function Card({ children, className = "", ...props }) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// ─── stat pill ───────────────────────────────────────────────────────────────

function StatPill({ label, value }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
        {label}
      </span>
      <span className="text-[17px] font-semibold text-gray-900">
        {value ?? "—"}
      </span>
    </div>
  );
}

// ─── animation variants ──────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1], delay },
  },
});

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const itemFade = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.38, ease: "easeOut" } },
};

const popupVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 22, mass: 0.9 },
  },
  exit: { opacity: 0, scale: 0.92, y: 20, transition: { duration: 0.2 } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// ─── component ───────────────────────────────────────────────────────────────

export default function MyProfile() {
  const [edit, setEdit] = useState(false);
  const [changePass, setchangePass] = useState(false);
  const [deleteAcc, setDeleteAcc] = useState(false);
  const [grouped, setGrouped] = useState([]);
  const { role } = useAuth();

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const el = document.getElementById(id);

      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  const { data: user } = useGetUser();
  const { data: cities } = useCities();
  const { data: quals } = useGetMyQualifications();
  const { data: vitals } = useGetVitals();
  const { data: ratings } = useGetMyRatings();
  const { data: allergies } = useGetMyAllergies();
  const { data: chronics } = useGetMyChronic();
  const { data: allAllergies } = useGetAllAllergies();
  const { data: allchronics } = useGetAllChronic();
  const { data: workingDetails } = useGetWorkingDetails();
  const { data: userImage } = useUserImage();
  const { data: apptData } = useGetWeeklyApp(role);
  console.log(apptData);

  const createUserImageMutation = useCreateUserImage();
  const updateUserImageMutation = useUpdateUserImage();
  const deleteUserImageMutation = useDeleteUserImage();
  const fileInputRef = useRef(null);

  const { data: inPersonSlots, isLoading: loadingInPerson } = useGetSlots(
    role,
    "in-person",
    user?.id,
  );
  const { data: onlineSlots, isLoading: loadingOnline } = useGetSlots(
    role,
    "online",
    user?.id,
  );

  const isWorkingDetailsEmpty = workingDetails
    ? Object.values(workingDetails).every((v) => v === null)
    : true;

  const profileImageUrl =
    userImage?.imageUrl1 ||
    userImage?.imageUrl ||
    user?.imageUrl ||
    user?.profileImageUrl ||
    "";

  // vitals transform
  useEffect(() => {
    if (!vitals) return;
    const newg = vitals.reduce((acc, item) => {
      const tid = item.vitalSignTypeId;
      if (!acc[tid]) acc[tid] = [];
      const dateStr = `${item.date.split("T")[0]}-[${item.date.split("T")[1]?.split(".")[0]}]`;
      if (tid === 1)
        acc[1].unshift({
          systolic: item.value,
          diastolic: item.value2,
          date: dateStr,
        });
      if (tid === 2) acc[2].unshift({ heartRate: item.value, date: dateStr });
      if (tid === 3) acc[3].unshift({ glucose: item.value, date: dateStr });
      return acc;
    }, {});
    setGrouped(newg);
  }, [vitals]);

  // mutations
  const deleteAccMutation = useDeleteMyAcc();
  const editPatientMutation = useEditPatientProfile();
  const changePasswordMutation = useChangePassword();
  const useAddVitalMutation = useAddVitals();
  const editAllergiesMutation = useEditAllergies();
  const editChronicsMutation = useEditChronics();

  const addVitals = async (values) => {
    await useAddVitalMutation.mutateAsync({
      vitalSignTypeId: values.vitalSignTypeId,
      value: values.systolic ?? values.heartRate ?? values.glucose,
      value2: values.diastolic ?? null,
    });
  };

  const editAllergies = (values) => editAllergiesMutation.mutate(values);
  const editchronics = (values) => editChronicsMutation.mutate(values);
  const deleteAccountHandle = () => deleteAccMutation.mutate();

  const changePasswordSubmitting = async (values, { setSubmitting }) => {
    try {
      const res = await changePasswordMutation.mutateAsync(values);
      if (res.status === 200) setchangePass(false);
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const editSubmitting = async (values, { setSubmitting }) => {
    if (role === "Patient") {
      ["addressId", "bloodType", "maritalStatus", "smokingStatus"].forEach(
        (key) => (values[key] = Number(values[key])),
      );
    }
    try {
      await editPatientMutation.mutateAsync(values);
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
      setEdit(false);
    }
  };

  const uploadProfileImage = async (file) => {
    if (!file) return;
    try {
      if (profileImageUrl) {
        await updateUserImageMutation.mutateAsync(file);
      } else {
        await createUserImageMutation.mutateAsync(file);
      }
      toast.success("Profile image uploaded.", { position: "top-center" });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        "Could not upload image.";
      toast.error(msg, { position: "top-center" });
    }
  };

  // ─── derived stats ───────────────────────────────────────────────────────
  const patientStats = [
    { label: "Gender", value: genderData[user?.gender] },
    { label: "Age", value: user?.age },
    { label: "Blood type", value: bloodTypeData[user?.bloodType] },
    { label: "Height", value: user?.height ? `${user.height} cm` : null },
    { label: "Weight", value: user?.weight ? `${user.weight} kg` : null },
    { label: "Smoking", value: SmokingData[user?.smokingStatus] },
    { label: "Marital", value: martialData[user?.maritalStatus] },
  ];

  const doctorStats = [
    { label: "Gender", value: genderData[user?.gender] },
    { label: "Age", value: user?.age },
    { label: "Specialization", value: user?.specializationName },
    {
      label: "Experience",
      value: user?.yearsOfExperience ? `${user.yearsOfExperience} yrs` : null,
    },
    { label: "Rating", value: user?.averageRating },
  ];

  const charts = [
    {
      title: "Blood pressure",
      data: grouped[1] ?? [],
      domain: [40, 200],
      fields: [
        {
          key: "systolic",
          label: "Systolic",
          min: 40,
          max: 200,
          color: "#ef4444",
        },
        {
          key: "diastolic",
          label: "Diastolic",
          min: 40,
          max: 130,
          color: "#14b8a6",
        },
      ],
    },
    {
      title: "Heart rate",
      data: grouped[2] ?? [],
      domain: [40, 180],
      fields: [
        {
          key: "heartRate",
          label: "Heart rate (BPM)",
          min: 40,
          max: 180,
          color: "#f97316",
        },
      ],
    },
    {
      title: "Glucose",
      data: grouped[3] ?? [],
      domain: [40, 180],
      fields: [
        {
          key: "glucose",
          label: "Glucose (mg/dL)",
          min: 70,
          max: 180,
          color: "#eab308",
        },
      ],
    },
  ];

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Delete account modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {deleteAcc && (
          <>
            <motion.div
              className="w-full h-screen fixed top-0 left-0 z-50 bg-black/55 flex justify-center items-center"
              variants={overlayVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={() => setDeleteAcc(false)}
            />
            <motion.div
              className="w-full md:w-[60%] lg:w-2/5 p-6 bg-white flex flex-col gap-6 max-h-screen overflow-auto
                         fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] rounded-2xl shadow-xl"
              variants={popupVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <IoCloseSharp
                className="absolute top-4 right-4 text-2xl cursor-pointer text-gray-400 hover:text-gray-700"
                onClick={() => setDeleteAcc(false)}
              />
              <p className="text-3xl font-bold text-red-500">Delete Account</p>
              <Formik
                initialValues={{ confirm: "" }}
                validationSchema={deleteAccValidationSchema}
                onSubmit={deleteAccountHandle}
              >
                {({ isValid, dirty, isSubmitting }) => (
                  <Form className="flex flex-col gap-6">
                    <FormInputField
                      name="confirm"
                      label='Enter "Delete my account"'
                      className="pl-3!"
                    />
                    <SubmitButton
                      text="Delete"
                      isLoading={isSubmitting}
                      disabled={!isValid || !dirty}
                      className="bg-red-500!"
                    />
                  </Form>
                )}
              </Formik>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Change password modal ────────────────────────────────────────── */}
      <AnimatePresence>
        {changePass && (
          <>
            <motion.div
              className="w-full h-screen fixed top-0 left-0 z-50 bg-black/55"
              variants={overlayVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={() => setchangePass(false)}
            />
            <motion.div
              className="w-full md:w-[60%] lg:w-2/5 p-6 bg-white flex flex-col gap-6 max-h-screen overflow-auto
                         fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] rounded-2xl shadow-xl"
              variants={popupVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <IoCloseSharp
                className="absolute top-4 right-4 text-2xl cursor-pointer text-gray-400 hover:text-gray-700"
                onClick={() => setchangePass(false)}
              />
              <p className="text-3xl font-bold text-gray-900">
                Change Password
              </p>
              <Formik
                onSubmit={changePasswordSubmitting}
                initialValues={changePasswordInitialValues}
                validationSchema={changePasswordValidationSchema}
              >
                {({ isValid, dirty, isSubmitting }) => (
                  <Form className="flex flex-col gap-3 w-full px-1">
                    <FormInputField
                      type="password"
                      name="oldPassword"
                      label="Old Password"
                      className="pl-3!"
                    />
                    <FormInputField
                      type="password"
                      name="newPassword"
                      label="New Password"
                      className="pl-3!"
                    />
                    <FormInputField
                      type="password"
                      name="confirmNewPassword"
                      label="Confirm Password"
                      className="pl-3!"
                    />
                    <SubmitButton
                      text="Change"
                      disabled={!isValid || !dirty}
                      isLoading={isSubmitting}
                      loadingText="Changing"
                      className="mt-5!"
                    />
                  </Form>
                )}
              </Formik>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Edit profile modal ───────────────────────────────────────────── */}
      <AnimatePresence>
        {edit && (
          <>
            <motion.div
              className="w-full h-screen fixed top-0 left-0 z-50 bg-black/55"
              variants={overlayVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={() => setEdit(false)}
            />
            <motion.div
              className="w-full md:w-[60%] lg:w-2/5 p-6 bg-white flex flex-col gap-6 max-h-screen overflow-auto
                         fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] rounded-2xl shadow-xl"
              variants={popupVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <IoCloseSharp
                className="absolute top-4 right-4 text-2xl cursor-pointer text-gray-400 hover:text-gray-700"
                onClick={() => setEdit(false)}
              />

              <div className="flex justify-between items-center gap-3">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 260 }}
                >
                  <AvatarIcon size={90} />
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2 font-semibold cursor-pointer border-blue-600 border-2 rounded-xl text-blue-600 px-4"
                >
                  Upload image
                </motion.button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    await uploadProfileImage(file);
                    e.target.value = "";
                  }}
                />
                {profileImageUrl && (
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await deleteUserImageMutation.mutateAsync();
                        toast.success("Profile image removed.", {
                          position: "top-center",
                        });
                      } catch (err) {
                        const msg =
                          err?.response?.data?.message ||
                          err?.response?.data?.title ||
                          "Could not delete image.";
                        toast.error(msg, { position: "top-center" });
                      }
                    }}
                    className="py-2 font-semibold cursor-pointer border-red-500 border-2 rounded-xl text-red-500 px-4"
                  >
                    Delete image
                  </button>
                )}
              </div>

              <Formik
                onSubmit={editSubmitting}
                validationSchema={
                  role === "Patient"
                    ? editPatientProfileValidationSchema
                    : editDoctorProfileValidationSchema
                }
                initialValues={
                  role === "Patient"
                    ? {
                        firstName: user?.firstName,
                        lastName: user?.lastName,
                        phoneNamber: user?.phoneNumber,
                        addressId: user?.addressId ? `${user.addressId}` : "",
                        height: user?.height,
                        weight: user?.weight,
                        smokingStatus: `${user?.smokingStatus}`,
                        maritalStatus: `${user?.maritalStatus}`,
                        bloodType: `${user?.bloodType}`,
                      }
                    : {
                        firstName: user?.firstName,
                        lastName: user?.lastName,
                        phoneNumber: user?.phoneNumber,
                        address: user?.address,
                        about: user?.about,
                      }
                }
                enableReinitialize
              >
                {({ isValid, dirty, isSubmitting }) => (
                  <Form className="flex flex-col gap-3 w-full px-1">
                    <div className="flex gap-2 items-center w-full">
                      <FormInputField
                        name="firstName"
                        label="First Name*"
                        className="!pl-2"
                      />
                      <FormInputField
                        name="lastName"
                        label="Last Name*"
                        className="!pl-2"
                      />
                    </div>
                    {role === "Doctor" && (
                      <>
                        <FormInputField
                          name="address"
                          label="Address*"
                          className="!pl-2"
                        />
                        <FormInputField
                          name="phoneNumber"
                          label="Phone Number*"
                          className="pl-3!"
                        />
                        <FormInputField
                          name="about"
                          label="About*"
                          type="text area"
                          className="pl-3!"
                        />
                      </>
                    )}
                    {role === "Patient" && (
                      <>
                        <FormInputField
                          name="phoneNamber"
                          label="Phone Number"
                          className="pl-3!"
                        />
                        <FormInputField
                          name="addressId"
                          label="Address"
                          placeholder="Select City"
                          className="pl-3!"
                          options={cities?.map(({ id, name }) => ({
                            value: id,
                            label: name,
                          }))}
                        />
                        <div className="flex gap-2 items-center w-full">
                          <FormInputField
                            name="height"
                            label="Height"
                            type="number"
                            className="pl-3!"
                          />
                          <FormInputField
                            name="weight"
                            label="Weight"
                            type="number"
                            className="pl-3!"
                          />
                        </div>
                        <div className="flex gap-2 items-center w-full">
                          <FormInputField
                            name="smokingStatus"
                            label="Smoking"
                            options={[
                              { value: 0, label: "Non-smoker" },
                              { value: 1, label: "Smoker" },
                              { value: 2, label: "Former" },
                            ]}
                          />
                          <FormInputField
                            name="maritalStatus"
                            label="Marital status"
                            options={[
                              { value: "0", label: "Single" },
                              { value: "1", label: "Married" },
                              { value: "2", label: "Divorced" },
                              { value: "3", label: "Widowed" },
                            ]}
                          />
                        </div>
                        <FormInputField
                          name="bloodType"
                          label="Blood Type"
                          options={[
                            { value: 0, label: "A+" },
                            { value: 1, label: "A-" },
                            { value: 2, label: "B+" },
                            { value: 3, label: "B-" },
                            { value: 4, label: "AB+" },
                            { value: 5, label: "AB-" },
                            { value: 6, label: "O+" },
                            { value: 7, label: "O-" },
                          ]}
                        />
                      </>
                    )}
                    <SubmitButton
                      text="Save changes"
                      disabled={!isValid || !dirty}
                      isLoading={isSubmitting}
                      loadingText="Saving"
                      className="mt-5!"
                    />
                  </Form>
                )}
              </Formik>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Page ─────────────────────────────────────────────────────────── */}
      <div className="min-h-screen bg-[#f8f9fb] font-english pt-[60px]">
        {/* ── Hero banner ──────────────────────────────────────────────────── */}
        <div className="relative h-[200px] md:h-[240px] overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg,#1e3a5f 0%,#185FA5 55%,#0ea5e9 100%)",
            }}
          />
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.06]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="dots"
                width="28"
                height="28"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2" cy="2" r="1.5" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        {/* ── Content ──────────────────────────────────────────────────────── */}
        <div className="px-4 md:px-8 lg:px-12 pb-16 max-w-[1200px] mx-auto">
          {/* ── Profile card (overlaps hero) ───────────────────────────────── */}
          <motion.div variants={fadeUp(0)} initial="hidden" animate="show">
            <Card className="relative -mt-[72px] p-5 md:p-6 flex flex-col sm:flex-row items-center sm:items-end gap-5">
              {/* avatar */}
              <motion.div
                className="size-[120px] md:size-[140px] rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border-4 border-white shadow-lg"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 260 }}
              >
                {profileImageUrl ? (
                  <img
                    src={profileImageUrl}
                    alt="Profile"
                    style={{
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "top",
                    }}
                    className="w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-end justify-center overflow-hidden">
                    <IoPersonSharp className="text-[100px] text-gray-400 translate-y-3" />
                  </div>
                )}
              </motion.div>

              {/* name + contact + actions */}
              <div className="flex-1 flex flex-col sm:flex-row sm:items-end justify-between gap-4 w-full">
                <div>
                  <p className="text-[22px] md:text-[26px] font-bold text-gray-900 leading-tight">
                    {user ? `${user.firstName} ${user.lastName}` : "—"}
                  </p>
                  <p className="text-[13px] text-gray-400 mt-0.5">{role}</p>
                  <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-3">
                    {[
                      { Icon: FaPhone, val: user?.phoneNumber },
                      { Icon: FaEnvelope, val: user?.email },
                      {
                        Icon: FaMapMarkerAlt,
                        val: user?.address || "Not specified",
                      },
                    ].map(({ Icon, val }) => (
                      <span
                        key={val}
                        className="flex items-center gap-1.5 text-[13px] text-gray-500"
                      >
                        <Icon className="text-gray-400 size-[13px]" />
                        {val}
                      </span>
                    ))}
                  </div>
                </div>

                {/* action buttons */}
                <div className="flex flex-wrap gap-2 self-start sm:self-auto">
                  <motion.button
                    onClick={() => setEdit(true)}
                    whileHover={{
                      y: -2,
                      boxShadow: "0 8px 24px rgba(24,95,165,.25)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200/60"
                  >
                    <FaRegEdit size={14} /> Edit profile
                  </motion.button>
                  <motion.button
                    onClick={() => setchangePass(true)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-blue-600 text-blue-600 text-[13px] font-semibold hover:bg-blue-50 transition-colors"
                  >
                    <MdOutlinePassword size={15} /> Password
                  </motion.button>
                  <motion.button
                    onClick={() => setDeleteAcc(true)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 border-red-400 text-red-500 text-[13px] font-semibold hover:bg-red-50 transition-colors"
                  >
                    <IoTrashOutline size={15} /> Delete
                  </motion.button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* ── Two-column grid ──────────────────────────────────────────────── */}
          <div className="mt-5 flex flex-col lg:flex-row gap-5 items-start">
            {/* ── Left sidebar ─────────────────────────────────────────────── */}
            <motion.div
              className="w-full lg:w-[300px] flex flex-col gap-4 flex-shrink-0"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              {/* Stats */}
              <motion.div variants={itemFade}>
                <Card className="p-5">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    {role === "Doctor" ? "Doctor info" : "Patient info"}
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                    {(role === "Doctor" ? doctorStats : patientStats).map(
                      (s) => (
                        <StatPill
                          key={s.label}
                          label={s.label}
                          value={s.value}
                        />
                      ),
                    )}
                  </div>
                </Card>
              </motion.div>

              {/* Medical reports (patient only) */}
              {role === "Patient" && (
                <motion.div variants={itemFade}>
                  <Card className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                        Medical reports
                      </p>
                      <FaFileCirclePlus className="size-[16px] text-blue-600 cursor-pointer" />
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {[
                        "Complete Blood Count",
                        "Liver Function",
                        "Kidney Function",
                        "Blood Sugar",
                      ].map((r, i) => (
                        <motion.div
                          key={i}
                          whileHover={{ x: 4 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 20,
                          }}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors flex-shrink-0">
                              <FaFileMedicalAlt className="text-blue-500 size-[14px]" />
                            </div>
                            <span className="text-[13px] text-gray-700 font-medium">
                              {r} Report
                            </span>
                          </div>
                          <IoTrashOutline className="size-[15px] text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Allergies + Chronics (patient only) */}
              {role === "Patient" && (
                <>
                  <motion.div variants={itemFade}>
                    <PatientSection
                      Icon={PiWarningCircle}
                      title="Allergies"
                      data={allergies}
                      alldata={allAllergies}
                      submitfn={editAllergies}
                    />
                  </motion.div>
                  <motion.div variants={itemFade}>
                    <PatientSection
                      Icon={GiMedicines}
                      title="Chronic diseases"
                      data={chronics}
                      alldata={allchronics}
                      submitfn={editchronics}
                    />
                  </motion.div>
                </>
              )}
            </motion.div>

            {/* ── Right main ───────────────────────────────────────────────── */}
            <motion.div
              className="w-full md:flex-1 min-w-0 flex flex-col gap-4"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              {/* Doctor sections */}
              {role === "Doctor" && (
                <>
                  <motion.div variants={itemFade}>
                    <Card className="p-5">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        About
                      </p>
                      <p className="text-[14px] text-gray-600 leading-relaxed">
                        {user?.about ||
                          "Add a short bio to personalize your profile."}
                      </p>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemFade}>
                    <DoctorSection title="Qualifications" info={quals} />
                  </motion.div>

                  <motion.div variants={itemFade}>
                    <DoctorSection title="Experience" />
                  </motion.div>

                  <motion.div variants={itemFade}>
                    <WorkDetailsCard
                      workingDetails={workingDetails}
                      isWorkingDetailsEmpty={isWorkingDetailsEmpty}
                      rightItem={itemFade}
                    />
                  </motion.div>

                  <motion.div variants={itemFade}>
                    <div id="myapp">
                      <Card className="p-5">
                        <Schedule
                          title="My Schedule"
                          subtitle="Manage your available slots"
                          role={role}
                          workingDetails={workingDetails}
                          serverSlots={{
                            inPerson: inPersonSlots ?? [],
                            online: onlineSlots ?? [],
                          }}
                          isLoadingSlots={loadingInPerson || loadingOnline}
                          id={user?.id}
                        />
                      </Card>
                    </div>
                  </motion.div>

                  <motion.div variants={itemFade}>
                    <BarComp
                      title="Appointments"
                      data={
                        apptData
                          ? apptData.map((i) => {
                              return {
                                date: i.date.split("T")[0],
                                count: i.appointmentCount,
                              };
                            })
                          : []
                      }
                    />
                  </motion.div>
                </>
              )}

              {/* Patient charts */}
              {role === "Patient" &&
                charts.map(({ title, data, domain, fields }) => (
                  <motion.div
                    key={title}
                    variants={itemFade}
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 240, damping: 22 }}
                  >
                    <ChartComp
                      title={title}
                      data={data}
                      domain={domain}
                      fields={fields}
                      onAdd={addVitals}
                    />
                  </motion.div>
                ))}
            </motion.div>
          </div>

          {/* ── Doctor ratings ──────────────────────────────────────────────── */}
          {role === "Doctor" && ratings?.ratings?.length > 0 && (
            <motion.div
              className="mt-5"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, ease: "easeOut", delay: 0.2 }}
            >
              <Card className="p-5 md:p-6">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-5">
                  Patient reviews
                </p>
                <SwiperComponent
                  Card={CommentCard}
                  data={ratings.ratings}
                  mapProps={(item) => ({
                    name: item.PatientName,
                    photo: profilePhoto,
                    starsNo: item.Score,
                    heading: item.Heading,
                    body: item.Comment,
                  })}
                />
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
