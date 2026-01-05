import { IoPersonSharp } from "react-icons/io5";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaRegEdit } from "react-icons/fa";
import ChartComp from "../../Components/Common/ChartComp";
import { useGetUser } from "../../hooks/useGetUser";
import { MdOutlinePassword } from "react-icons/md";
import profilePhoto from "../../assets/images/profile.webp";
import { useAuth } from "../../Context/AuthContext";
import BarComp from "../../Components/Common/BarComp";
import { IoTrashOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { FaFileCirclePlus } from "react-icons/fa6";
import AvatarIcon from "./../../Components/Common/AvatarIcon1";
import { GiMedicines } from "react-icons/gi";
import { Form, Formik } from "formik";
import FormInputField from "./../../Components/Auth/FormInputField";
import SubmitButton from "../../Components/Auth/SubmitButton";
import { IoCloseSharp } from "react-icons/io5";
import CommentCard from "../../Components/Common/CommentCard";
import { motion, AnimatePresence } from "framer-motion";
import { PiWarningCircle } from "react-icons/pi";
import { FaFileMedicalAlt } from "react-icons/fa";
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
import ReviewsDetailsSection from "./../../Components/Common/ReviewsDetailsSection";
import SwiperComponent from "../../Components/Common/SwiperComponent";
import { useGetMyAllergies } from "../../hooks/useGetMyAllergies";
import { useGetMyChronic } from "../../hooks/useGetMyChronic";
import PatientSection from "../../Components/Profile/PatientSection";
import { useGetAllAllergies } from "../../hooks/useGetAllAllergies";
import { useGetAllChronic } from "../../hooks/useGetAllChronic";
import { useEditAllergies } from "../../hooks/useEditAllergies";
import { useEditChronics } from "../../hooks/useEditChronics";
import { IoWarningOutline } from "react-icons/io5";

const genderData = ["Male", "Female"];

const bloodTypeData = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const SmokingData = ["No", "Yes", "EX-Smoker"];

const martialData = ["Single", "Married", "Divorced", "Widowed"];

const appointmentData = [
  { date: "2025-01-01", count: 5 },
  { date: "2025-01-02", count: 8 },
  { date: "2025-01-03", count: 3 },
  { date: "2025-01-04", count: 4 },
  { date: "2025-01-05", count: 10 },
  { date: "2025-01-06", count: 5 },
  { date: "2025-01-07", count: 14 },
];

export default function Profile() {
  const [edit, setEdit] = useState(false);
  const [changePass, setchangePass] = useState(false);
  const [deleteAcc, setDeleteAcc] = useState(false);
  const [grouped, setGrouped] = useState([]);

  const { data: user } = useGetUser();
  const { data: cities } = useCities();
  const { data: quals } = useGetMyQualifications();
  const { data: vitals } = useGetVitals();
  const { data: ratings } = useGetMyRatings();
  const { data: allergies } = useGetMyAllergies();
  const { data: chronics } = useGetMyChronic();
  const { data: allAllergies } = useGetAllAllergies();
  const { data: allchronics } = useGetAllChronic();
  const { role } = useAuth();

  //transforming vitals data
  useEffect(() => {
    if (!vitals) return;
    let newg = vitals.reduce((acc, item) => {
      let id = item.vitalSignTypeId;
      if (!acc[id]) acc[id] = [];
      if (id === 1) {
        acc[1].unshift({
          systolic: item.value,
          diastolic: item.value2,
          date: `${item.date.split("T")[0]}-[${
            item.date.split("T")[1].split(".")[0]
          }]`,
        });
      } else if (id === 2) {
        acc[2].unshift({
          heartRate: item.value,
          date: `${item.date.split("T")[0]}-[${
            item.date.split("T")[1].split(".")[0]
          }]`,
        });
      } else if (id === 3) {
        acc[3].unshift({
          glucose: item.value,
          date: `${item.date.split("T")[0]}-[${
            item.date.split("T")[1].split(".")[0]
          }]`,
        });
      }
      return acc;
    }, {});
    setGrouped(newg);
  }, [vitals]);

  const deleteAccMutation = useDeleteMyAcc();

  const editPatientMutation = useEditPatientProfile();

  const changePasswordMutation = useChangePassword();

  const useAddVitalMutation = useAddVitals();

  const editAllergiesMutation = useEditAllergies();

  const editChronicsMutation = useEditChronics();

  const addVitals = async (values) => {
    const FormData = {
      vitalSignTypeId: values.vitalSignTypeId,
      value: values.systolic ?? values.heartRate ?? values.glucose,
      value2: values.diastolic ?? null,
    };
    await useAddVitalMutation.mutateAsync(FormData);
  };

  const editAllergies = (values) => {
    editAllergiesMutation.mutate(values);
  };
  const editchronics = (values) => {
    editChronicsMutation.mutate(values);
  };

  const deleteAccountHandle = () => {
    deleteAccMutation.mutate();
  };

  const changePasswordSubmitting = async (values, { setSubmitting }) => {
    try {
      const res = await changePasswordMutation.mutateAsync(values);
      res.status === 200 && setchangePass(false);
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const editSubmitting = async (values, { setSubmitting }) => {
    console.log(values);

    if (role === "Patient") {
      ["addressId", "bloodType", "maritalStatus", "smokingStatus"].forEach(
        (key) => (values[key] = Number(values[key]))
      );
    }
    try {
      const res = await editPatientMutation.mutateAsync(values);
      console.log(res);
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
      setEdit(false);
    }
  };

  // ================= POPUP =================
  const popupVariants = {
    hidden: {
      opacity: 0,
      scale: 0.92,
      y: 20,
    },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 22,
        mass: 0.9,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.92,
      y: 20,
      transition: { duration: 0.2 },
    },
  };

  // ================= OVERLAY =================
  const overlayVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.25 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  // ================= RIGHT CONTAINER =================
  const rightContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
      },
    },
  };

  // ================= RIGHT ITEM =================
  const rightItem = {
    hidden: {
      opacity: 0,
      x: 25,
    },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: { duration: 0.2 },
    },
  };

  // ================= SIDEBAR CONTAINER =================
  const sidebarContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.04,
      },
    },
  };

  // ================= SIDEBAR ITEM =================
  const sidebarItem = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.35,
        ease: "easeOut",
      },
    },
  };

  return (
    <>
      <AnimatePresence>
        {deleteAcc && (
          <>
            <motion.div
              className="w-full h-screen fixed top-0 left-0 z-50 bg-[#0000008f] flex justify-center items-center"
              variants={overlayVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={() => setDeleteAcc(false)}
            />
            <motion.div
              className="w-full md:w-[60%] lg:w-2/5 p-[20px] bg-white flex flex-col gap-[30px] max-h-screen overflow-auto fixed top-1/2 left-1/2 
                   -translate-x-1/2 -translate-y-1/2 z-[60] rounded-xl shadow-lg"
              variants={popupVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <IoCloseSharp
                className="absolute top-3 right-3 text-3xl cursor-pointer"
                onClick={() => setDeleteAcc(false)}
              />

              <p className="text-4xl font-bold text-red-500 ">Delete Account</p>
              <Formik
                initialValues={{ confirm: "" }}
                validationSchema={deleteAccValidationSchema}
                onSubmit={deleteAccountHandle}
              >
                {({ isValid, dirty, isSubmitting }) => (
                  <Form className="flex flex-col gap-[30px]">
                    <FormInputField
                      name={"confirm"}
                      label={'Enter "Delete my account"'}
                      className="pl-[10px]!"
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

      <AnimatePresence>
        {changePass && (
          <>
            <motion.div
              className="w-full h-screen fixed top-0 left-0 z-50 bg-[#0000008f] flex justify-center items-center"
              variants={overlayVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={() => setchangePass(false)}
            />

            <motion.div
              className="w-full md:w-[60%] lg:w-2/5 p-[20px] bg-white flex flex-col gap-[30px] max-h-screen overflow-auto fixed top-1/2 left-1/2 
                   -translate-x-1/2 -translate-y-1/2 z-[60] rounded-xl shadow-lg"
              variants={popupVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <IoCloseSharp
                className="absolute top-3 right-3 text-3xl cursor-pointer"
                onClick={() => setchangePass(false)}
              />

              <p className="text-4xl font-bold ">Change Password</p>

              <Formik
                onSubmit={changePasswordSubmitting}
                initialValues={changePasswordInitialValues}
                validationSchema={changePasswordValidationSchema}
              >
                {({ isValid, dirty, isSubmitting }) => (
                  <Form className="flex flex-col gap-[8px] w-full px-[20px]">
                    <FormInputField
                      type="password"
                      name="oldPassword"
                      label={"Old Password"}
                      className="pl-[10px]!"
                    />
                    <FormInputField
                      type="password"
                      name="newPassword"
                      label={"New Password"}
                      className="pl-[10px]!"
                    />
                    <FormInputField
                      type="password"
                      name="confirmNewPassword"
                      label={"Confirm Password"}
                      className="pl-[10px]!"
                    />
                    <SubmitButton
                      text="Change"
                      disabled={!isValid || !dirty}
                      isLoading={isSubmitting}
                      loadingText="Changing"
                      className="mt-[20px]!"
                    />
                  </Form>
                )}
              </Formik>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {edit && (
          <>
            <motion.div
              className="w-full h-screen fixed top-0 left-0 z-50 bg-[#0000008f] flex justify-center items-center"
              variants={overlayVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={() => setEdit(false)}
            />

            <motion.div
              className=" w-full md:w-[60%] lg:w-2/5 p-[20px] bg-white flex flex-col gap-[30px] max-h-screen overflow-auto fixed top-1/2 left-1/2 
                   -translate-x-1/2 -translate-y-1/2 z-[60] rounded-xl shadow-lg"
              variants={popupVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <IoCloseSharp
                className="absolute top-3 right-3 text-3xl cursor-pointer"
                onClick={() => setEdit(false)}
              />

              <div className="flex justify-between items-center">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 260 }}
                >
                  <AvatarIcon size={90} />
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="py-[5px] font-bold cursor-pointer border-blue-600 border-2 rounded-[10px] text-blue-600 px-[10px] flex justify-center items-center"
                >
                  Upload image
                </motion.button>
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
                enableReinitialize={true}
              >
                {({ isValid, dirty, isSubmitting }) => (
                  <Form className="flex flex-col gap-[8px] w-full px-[20px]">
                    <div className="flex gap-1.5 items-center w-full">
                      <FormInputField
                        name={"firstName"}
                        label={"FirstName*"}
                        className=" !pl-2"
                      />
                      <FormInputField
                        name={"lastName"}
                        label={"LastName*"}
                        className=" !pl-2"
                      />
                    </div>
                    {role === "Doctor" && (
                      <>
                        <FormInputField
                          name={"address"}
                          label={"Address*"}
                          className=" !pl-2"
                        />
                        <FormInputField
                          name={"phoneNumber"}
                          label={"Phone Number*"}
                          className="pl-[10px]!"
                        />

                        <FormInputField
                          name={"about"}
                          label={"About*"}
                          type="text area"
                          className="pl-[10px]!"
                        />
                      </>
                    )}

                    {role === "Patient" && (
                      <>
                        <FormInputField
                          name={"phoneNamber"}
                          label={"Phone Number"}
                          className="pl-[10px]!"
                        />
                        <FormInputField
                          name={"addressId"}
                          label={"Address"}
                          placeholder={"Select City"}
                          className="pl-[10px]!"
                          options={cities.map(({ id, name }) => ({
                            value: id,
                            label: name,
                          }))}
                        />

                        <div className="flex gap-1.5 items-center w-full">
                          <FormInputField
                            name={"height"}
                            label={"Height"}
                            type="number"
                            className="pl-[10px]!"
                          />
                          <FormInputField
                            name={"weight"}
                            label={"Weight"}
                            type="number"
                            className="pl-[10px]!"
                          />
                        </div>

                        <div className="flex gap-1.5 items-center w-full">
                          <FormInputField
                            name={"smokingStatus"}
                            label={"Smoking"}
                            options={[
                              { value: 0, label: "Non-smoker" },
                              { value: 1, label: "Smoker" },
                              { value: 2, label: "Former" },
                            ]}
                          />

                          <FormInputField
                            name={"maritalStatus"}
                            label={"Martial status"}
                            options={[
                              { value: "0", label: "Single" },
                              { value: "1", label: "Married" },
                              { value: "2", label: "Divorced" },
                              { value: "3", label: "Widowed" },
                            ]}
                          />
                        </div>

                        <FormInputField
                          name={"bloodType"}
                          label={"Blood Type"}
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
                      text="Edit"
                      disabled={!isValid || !dirty}
                      isLoading={isSubmitting}
                      loadingText="Editing"
                      className="mt-[20px]!"
                    />
                  </Form>
                )}
              </Formik>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div className="flex flex-col gap-[70px] justify-center pb-[20px]">
        <div
          className="pt-[100px] w-full overflow-hidden pb-[10px] px-4 md:px-[30px] lg:px-[50px] min-h-screen font-english 
      flex flex-col lg:flex-row gap-[30px] lg:gap-[50px] justify-center"
        >
          {/* Sidebar */}
          <motion.div
            className="w-full lg:w-[350px] flex flex-col gap-[20px] flex-shrink-0 "
            variants={sidebarContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div
              variants={sidebarItem}
              className=" relative flex flex-col justify-center items-center 
          gap-[15px] p-[16px] rounded-[10px] bg-[#F5F6F7] shadow-md"
            >
              <motion.div
                // variants={sidebarItem}
                className="absolute size-[30px] rounded-full bg-white top-[10px] right-[10px] flex justify-center items-center"
              >
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IoTrashOutline
                    onClick={() => setDeleteAcc((prev) => !prev)}
                    className="size-[20px] text-red-500 cursor-pointer "
                  />
                </motion.div>
              </motion.div>

              <motion.div
                // variants={sidebarItem}
                className="w-[150px] h-[150px] md:w-[180px] md:h-[180px] lg:w-[200px] lg:h-[200px] 
            rounded-full overflow-hidden relative flex justify-center items-center bg-gray-200"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 260 }}
              >
                <IoPersonSharp
                  className="text-[130px] md:text-[160px] lg:text-[180px] text-white 
              absolute bottom-[-20px] left-1/2 translate-x-[-50%]"
                />
              </motion.div>

              <motion.div
                // variants={sidebarItem}
                className="flex flex-col gap-[5px] items-center"
              >
                <p className="text-2xl md:text-3xl font-bold">
                  {user && user?.firstName + " " + user?.lastName}
                </p>
                <p className="text-[#404448]">{role}</p>
              </motion.div>

              <hr className="w-full text-[rgb(193,193,193)]" />

              <motion.div
                // variants={sidebarItem}
                className="flex flex-col w-full gap-[15px] text-[#404448]"
              >
                <motion.div
                  // variants={sidebarItem}
                  className="flex items-center gap-[10px]"
                >
                  <FaPhone /> {user?.phoneNumber}
                </motion.div>
                <motion.div
                  // variants={sidebarItem}
                  className="flex items-center gap-[10px]"
                >
                  <FaEnvelope /> {user?.email}
                </motion.div>
                <motion.div
                  // variants={sidebarItem}
                  className="flex items-center gap-[10px]"
                >
                  <FaMapMarkerAlt />{" "}
                  {user?.address ? user?.address : "Not Specified"}
                </motion.div>
              </motion.div>

              <hr className="w-full text-[rgb(193,193,193)]" />

              <motion.div
                // variants={sidebarItem}
                className=" w-full gap-[15px]  flex flex-col md:flex-row lg:flex-col"
              >
                <motion.button
                  // variants={sidebarItem}
                  onClick={() => setEdit(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-[40px] cursor-pointer text-white font-bold text-[18px] bg-blue-600 
            rounded-[10px] flex justify-center items-center gap-[10px]"
                >
                  <FaRegEdit /> Edit
                </motion.button>
                <motion.button
                  // variants={sidebarItem}
                  onClick={() => setchangePass(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full border-2 cursor-pointer border-blue-600 h-[40px] text-blue-600 font-bold text-[18px] bg-white
            rounded-[10px] flex justify-center items-center gap-[10px]"
                >
                  <MdOutlinePassword /> Change Password
                </motion.button>
              </motion.div>
            </motion.div>
            <motion.div
              variants={sidebarItem}
              className=" relative  flex flex-col  
          gap-[20px] p-[16px] rounded-[10px] bg-white shadow-md"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-xl ">Medical Reports Archieve </h3>
                <FaFileCirclePlus className="size-[20px] text-blue-600 cursor-pointer " />
              </div>
              <div className="flex flex-col gap-[15px]">
                {[
                  "Complete Blood Count Report",
                  "Liver Function Report",
                  "Kidney Function Report",
                  "Blood Sugar Report",
                ].length !== 0 ? (
                  [
                    "Complete Blood Count Report",
                    "Liver Function Report",
                    "Kidney Function Report",
                    "Blood Sugar Report",
                  ].map((report, ind) => (
                    <div className="flex justify-between items-center">
                      <div id={ind} className="flex gap-2 items-center">
                        <FaFileMedicalAlt className="size-[25px] text-blue-600" />{" "}
                        {report}
                      </div>
                      <IoTrashOutline className="size-[20px] text-red-600 cursor-pointer " />
                    </div>
                  ))
                ) : (
                  <div className="flex gap-2">
                    <IoWarningOutline className="text-blue-600 size-[30px] shrink-0" />
                    <div className="flex flex-col gap-1 max-w-[250px]">
                      <p className="font-bold">No medical reports yet</p>
                      <p className="text-[12px]">
                        Upload your medical reports to keep your health history
                        complete and help doctors make better decisions
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
          {/* right */}
          <motion.div
            className="flex-1 w-full max-w-[1000px] flex flex-col items-center gap-[20px]"
            variants={rightContainer}
            initial="hidden"
            animate="show"
          >
            <motion.div
              variants={rightItem}
              className="w-full bg-white shadow-md rounded-xl p-4 md:p-5"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-5">
                {(role === "Patient"
                  ? [
                      { label: "Gender", value: genderData[user?.gender] },
                      { label: "Age", value: user?.age },
                      { label: "Blood", value: bloodTypeData[user?.bloodType] },
                      { label: "Height", value: user?.height },
                      { label: "Weight", value: user?.weight },
                      {
                        label: "Smoking",
                        value: SmokingData[user?.smokingStatus],
                      },
                      {
                        label: "Marital Status",
                        value: martialData[user?.maritalStatus],
                      },
                    ]
                  : [
                      { label: "Gender", value: genderData[user?.gender] },
                      { label: "Age", value: user?.age },
                      {
                        label: "Specialization",
                        value: user?.specializationName,
                      },
                      { label: "EXP.Years", value: user?.yearsOfExperience },
                      { label: "Rating", value: user?.averageRating },
                    ]
                ).map((item, i) => (
                  <div key={i} className="flex flex-col">
                    <p className="text-[#6D7379] text-[14px] md:text-[15px]">
                      {item.label}
                    </p>
                    <p className="text-[18px] md:text-[20px] font-semibold">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {role === "Doctor" && (
              <>
                <motion.div
                  variants={rightItem}
                  className="w-full bg-white shadow-md flex  gap-[20px] rounded-xl p-4 md:p-5"
                >
                  <p className="text-[20px] font-bold">About:</p>
                  <p className="pt-[5px]">
                    {user?.about !== ""
                      ? user?.about
                      : "Add a short bio to personalize your profile"}
                  </p>
                </motion.div>

                <motion.div variants={rightItem} className="w-full">
                  <DoctorSection
                    title={"Qualifications"}
                    info={quals && quals}
                  />
                </motion.div>

                <motion.div variants={rightItem} className="w-full">
                  <DoctorSection title={"Experience"} />
                </motion.div>

                <motion.div variants={rightItem} className="w-full">
                  <BarComp title="Appointment" data={appointmentData} />
                </motion.div>
              </>
            )}

            {role === "Patient" && (
              <>
                <motion.div variants={rightItem} className="w-full">
                  <div className="w-full md:flex-row flex-col flex justify-center items-start gap-[20px]">
                    <PatientSection
                      Icon={PiWarningCircle}
                      title="Allergies"
                      data={allergies}
                      alldata={allAllergies}
                      submitfn={editAllergies}
                    />

                    <PatientSection
                      Icon={GiMedicines}
                      title={"Chronic Diseases"}
                      data={chronics}
                      alldata={allchronics}
                      submitfn={editchronics}
                    />
                  </div>
                </motion.div>
                <motion.div
                  variants={rightItem}
                  className="w-full"
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 260 }}
                >
                  <ChartComp
                    title="Blood Pressure"
                    data={grouped[1] ? grouped[1] : []}
                    domain={[40, 200]}
                    onAdd={addVitals}
                    fields={[
                      {
                        key: "systolic",
                        label: "Systolic",
                        min: 40,
                        max: 200,
                        color: "#ff4d4f",
                      },
                      {
                        key: "diastolic",
                        label: "Diastolic",
                        min: 40,
                        max: 130,
                        color: "#36cfc9",
                      },
                    ]}
                  />
                </motion.div>

                <motion.div
                  variants={rightItem}
                  className="w-full"
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 260 }}
                >
                  <ChartComp
                    title="Heart Rate"
                    data={grouped[2] ? grouped[2] : []}
                    domain={[40, 180]}
                    fields={[
                      {
                        key: "heartRate",
                        label: "Heart Rate (BPM)",
                        min: 40,
                        max: 180,
                        color: "#ff7a45",
                      },
                    ]}
                    onAdd={addVitals}
                  />
                </motion.div>

                <motion.div
                  variants={rightItem}
                  className="w-full"
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 260 }}
                >
                  <ChartComp
                    title="Glucose"
                    data={grouped[3] ? grouped[3] : []}
                    domain={[40, 180]}
                    onAdd={addVitals}
                    fields={[
                      {
                        key: "glucose",
                        label: "Glucose (mg/dL)",
                        min: 70,
                        max: 180,
                        color: "#ffc107",
                      },
                    ]}
                  />
                </motion.div>
              </>
            )}
          </motion.div>
        </div>

        {role === "Doctor" && (
          <>
            <div className="w-[80%] flex flex-col gap-10 m-auto ">
              {ratings && (
                <>
                  <motion.div
                    variants={rightItem}
                    initial={{ opacity: 0, x: 80 }}
                    animate={{ opacity: 1, x: 0 }}
                    className=""
                  >
                    <ReviewsDetailsSection
                      NumOfReviews={ratings && ratings.totalRatings}
                      avgRating={ratings && ratings.averageRating}
                      addFlag={false}
                      data={ratings && ratings.scoreCounts}
                    />
                  </motion.div>

                  {ratings?.ratings?.length > 0 && (
                    <motion.div
                      variants={rightItem}
                      initial={{ opacity: 0, x: 80 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <SwiperComponent
                        Card={CommentCard}
                        data={ratings ? ratings.ratings : []}
                        mapProps={(item) => ({
                          name: item.PatientName,
                          photo: profilePhoto,
                          starsNo: item.Score,
                          heading: item.Heading,
                          body: item.Comment,
                        })}
                      />
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
