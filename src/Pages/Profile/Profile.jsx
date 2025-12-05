import { IoPersonSharp } from "react-icons/io5";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaRegEdit } from "react-icons/fa";
import ChartComp from "../../Components/Common/ChartComp";
import { useGetUser } from "../../hooks/useGetUser";
import { MdOutlinePassword } from "react-icons/md";
import { useAuth } from "../../Context/AuthContext";
import { FaGraduationCap } from "react-icons/fa6";
import { PiCertificate } from "react-icons/pi";
import { RiMedalLine } from "react-icons/ri";
import BarComp from "../../Components/Common/BarComp";
import { useState } from "react";
import AvatarIcon from "./../../Components/Common/AvatarIcon1";
import { Form, Formik } from "formik";
import FormInputField from "./../../Components/Auth/FormInputField";
import SubmitButton from "../../Components/Auth/SubmitButton";
import { IoCloseSharp } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import {
  changePasswordValidationSchema,
  editProfileValidationSchema,
} from "../../utils/validationSchemas";
import { changePasswordInitialValues } from "../../utils/formInitialValues";
import { useCities } from "../../hooks/useCities";
import { useEditPatientProfile } from "../../hooks/useEditPatientProfile";
import { useChangePassword } from "../../hooks/useChangePassword";
const data = [
  { date: "2025-01-01", systolic: 120, diastolic: 80 },
  { date: "2025-01-02", systolic: 130, diastolic: 85 },
  { date: "2025-01-03", systolic: 125, diastolic: 82 },
  { date: "2025-01-04", systolic: 140, diastolic: 90 },
  { date: "2025-01-05", systolic: 135, diastolic: 88 },
];

const genderData = ["Male", "Female"];

const bloodTypeData = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const SmokingData = ["No", "Yes", "EX-Smoker"];

const martialData = ["Single", "Married", "Divorced", "Widowed"];

const heartData = [
  { date: "2025-12-01", heartRate: 72 },
  { date: "2025-12-02", heartRate: 75 },
  { date: "2025-12-03", heartRate: 78 },
  { date: "2025-12-04", heartRate: 80 },
  { date: "2025-12-05", heartRate: 76 },
  { date: "2025-12-06", heartRate: 74 },
  { date: "2025-12-07", heartRate: 82 },
  { date: "2025-12-08", heartRate: 79 },
  { date: "2025-12-09", heartRate: 77 },
  { date: "2025-12-10", heartRate: 81 },
];

const glucoseData = [
  { date: "2025-12-01", glucose: 95 },
  { date: "2025-12-02", glucose: 102 },
  { date: "2025-12-03", glucose: 110 },
  { date: "2025-12-04", glucose: 98 },
  { date: "2025-12-05", glucose: 105 },
  { date: "2025-12-06", glucose: 99 },
  { date: "2025-12-07", glucose: 115 },
  { date: "2025-12-08", glucose: 107 },
  { date: "2025-12-09", glucose: 100 },
  { date: "2025-12-10", glucose: 112 },
];

const appointmentData = [
  { date: "2025-01-01", count: 5 },
  { date: "2025-01-02", count: 8 },
  { date: "2025-01-03", count: 3 },
  { date: "2025-01-04", count: 4 },
  { date: "2025-01-05", count: 10 },
  { date: "2025-01-06", count: 5 },
  { date: "2025-01-07", count: 7 },
  { date: "2025-01-08", count: 9 },
  { date: "2025-01-09", count: 6 },
];

export default function Profile() {
  const [edit, setEdit] = useState(false);
  const [changePass, setchangePass] = useState(false);
  const { data: user } = useGetUser();
  const { data: cities } = useCities();
  const { role } = useAuth();

  const editPatientMutation = useEditPatientProfile();

  const changePasswordMutation = useChangePassword();

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
      console.log(values);
      try {
        const res = await editPatientMutation.mutateAsync(values);
        console.log(res);
      } catch (err) {
        console.log(err);
      } finally {
        setSubmitting(false);
        setEdit(false);
      }
    }
  };

  const popupVariants = {
    hidden: { opacity: 0, scale: 0.7, y: 40 },
    show: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 2000,
        type: "spring",
        stiffness: 160,
        damping: 18,
      },
    },
    exit: { opacity: 0, scale: 0.7, y: 40 },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <>
      <AnimatePresence>
        {changePass && (
          <>
            {/* الخلفية */}
            <motion.div
              className="w-full h-screen fixed top-0 left-0 z-50 bg-[#0000008f] flex justify-center items-center"
              variants={overlayVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={() => setchangePass(false)}
            />

            {/* البوب أب */}
            <motion.div
              className="w-2/5 p-[20px] bg-white flex flex-col gap-[30px] max-h-screen overflow-auto fixed top-1/2 left-1/2 
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
                    />
                    <FormInputField
                      type="password"
                      name="newPassword"
                      label={"New Password"}
                    />
                    <FormInputField
                      type="password"
                      name="confirmNewPassword"
                      label={"Confirm PAssword"}
                    />
                    <SubmitButton
                      text="Change"
                      disabled={!isValid || !dirty}
                      isLoading={isSubmitting}
                      loadingText="Changing"
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
            {/* الخلفية */}
            <motion.div
              className="w-full h-screen fixed top-0 left-0 z-50 bg-[#0000008f] flex justify-center items-center"
              variants={overlayVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={() => setEdit(false)}
            />

            {/* البوب أب */}
            <motion.div
              className="w-2/5 p-[20px] bg-white flex flex-col gap-[30px] max-h-screen overflow-auto fixed top-1/2 left-1/2 
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
                <AvatarIcon size={90} />
                <button className="py-[5px] font-bold cursor-pointer border-blue-600 border-2 rounded-[10px] text-blue-600 px-[10px] flex justify-center items-center">
                  Upload image
                </button>
              </div>

              <Formik
                onSubmit={editSubmitting}
                validationSchema={editProfileValidationSchema}
                initialValues={{
                  firstName: user?.firstName,
                  lastName: user?.lastName,
                  phoneNamber: user?.phoneNumber,
                  addressId: user?.addressId ? user.addressId : "",
                  height: user?.height,
                  weight: user?.weight,
                  smokingStatus: `${user?.smokingStatus}`,
                  maritalStatus: `${user?.maritalStatus}`,
                  bloodType: `${user?.bloodType}`,
                }}
                enableReinitialize={true}
              >
                {({ isValid, dirty, isSubmitting }) => (
                  <Form className="flex flex-col gap-[8px] w-full px-[20px]">
                    <div className="flex gap-1.5 items-center w-full">
                      <FormInputField
                        name={"firstName"}
                        label={"FirstName"}
                        className="w-full p-0"
                      />
                      <FormInputField name={"lastName"} label={"LastName"} />
                    </div>

                    <FormInputField
                      name={"phoneNamber"}
                      label={"Phone Number"}
                    />

                    <FormInputField
                      name={"addressId"}
                      label={"Address"}
                      placeholder={"Select City"}
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
                      />
                      <FormInputField
                        name={"weight"}
                        label={"Weight"}
                        type="number"
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

                    <SubmitButton
                      text="Edit"
                      disabled={!isValid || !dirty}
                      isLoading={isSubmitting}
                      loadingText="Editing"
                    />
                  </Form>
                )}
              </Formik>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <div
        className="pt-[100px] px-4 md:px-[30px] lg:px-[50px] min-h-screen font-english 
      flex flex-col lg:flex-row gap-[30px] lg:gap-[50px] justify-center"
      >
        {/* Sidebar */}
        <div className="w-full lg:w-[350px] flex-shrink-0">
          <div
            className=" flex flex-col justify-center items-center 
          gap-[15px] p-[16px] rounded-[10px] bg-[#F5F6F7] shadow-md"
          >
            <div
              className="w-[150px] h-[150px] md:w-[180px] md:h-[180px] lg:w-[200px] lg:h-[200px] 
            rounded-full overflow-hidden relative flex justify-center items-center bg-gray-200"
            >
              <IoPersonSharp
                className="text-[130px] md:text-[160px] lg:text-[180px] text-white 
              absolute bottom-[-10px] left-1/2 translate-x-[-50%]"
              />
            </div>

            <div className="flex flex-col gap-[5px] items-center">
              <p className="text-2xl md:text-3xl font-bold">
                {user && user?.firstName + " " + user?.lastName}
              </p>
              <p className="text-[#404448]">{role}</p>
            </div>

            <hr className="w-full text-[rgb(193,193,193)]" />

            <div className="flex flex-col w-full gap-[15px] text-[#404448]">
              <div className="flex items-center gap-[10px]">
                <FaPhone /> {user?.phoneNumber}
              </div>
              <div className="flex items-center gap-[10px]">
                <FaEnvelope /> {user?.email}
              </div>
              <div className="flex items-center gap-[10px]">
                <FaMapMarkerAlt />{" "}
                {user?.address ? user?.address : "Not Specified"}
              </div>
            </div>

            <hr className="w-full text-[rgb(193,193,193)]" />

            <div className=" w-full gap-[15px]  flex flex-col md:flex-row lg:flex-col">
              <button
                onClick={() => setEdit(true)}
                className="w-full h-[40px] cursor-pointer text-white font-bold text-[18px] bg-blue-600 
            rounded-[10px] flex justify-center items-center gap-[10px]"
              >
                <FaRegEdit /> Edit
              </button>
              <button
                onClick={() => setchangePass(true)}
                className="w-full border-2 cursor-pointer border-blue-600 h-[40px] text-blue-600 font-bold text-[18px] bg-white
            rounded-[10px] flex justify-center items-center gap-[10px]"
              >
                <MdOutlinePassword /> Change Password
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 w-full max-w-[1000px] flex flex-col items-center gap-[20px]">
          {/* User Info */}
          <div className="w-full bg-white shadow-md rounded-xl p-4 md:p-5">
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
          </div>

          {role === "Doctor" && (
            <>
              <div className="w-full bg-white shadow-md flex  gap-[20px] rounded-xl p-4 md:p-5">
                <p className="text-[20px] font-bold">About:</p>
                <p className="pt-[5px]">
                  {user?.about !== ""
                    ? user?.about
                    : "Add a short bio to personalize your profile"}
                </p>
              </div>
              <div className="w-full bg-white shadow-md flex flex-col  gap-[10px] rounded-xl p-4 md:p-5">
                <p className="text-[20px] font-bold">Qualification</p>
                <div className="px-[20px] flex flex-col gap-[10px] ">
                  <div className="flex  items-center gap-[20px]">
                    <FaGraduationCap className="text-[28px] text-blue-600  " />
                    M.B.B.Ch, Faculty of Medicine – Cairo University (2012)
                  </div>
                  <div className="flex  items-center gap-[20px]">
                    <PiCertificate className="text-[28px] text-blue-600  " />
                    Master’s Degree in Cardiology – Ain Shams University (2017)
                  </div>
                  <div className="flex  items-center gap-[20px]">
                    <RiMedalLine className="text-[28px] text-blue-600  " />
                    Fellowship of the European Society of Cardiology (ESC)
                  </div>
                </div>
              </div>
              <div className="w-full bg-white shadow-md flex flex-col  gap-[10px] rounded-xl p-4 md:p-5">
                <p className="text-[20px] font-bold">Experience</p>
                <div className="px-[20px] flex flex-col gap-[10px] ">
                  <div className="flex  items-center gap-[20px]">
                    <FaGraduationCap className="text-[28px] text-blue-600  " />
                    Former Resident in Internal Medicine at Cairo University
                    Hospitals (2013 – 2016)
                  </div>
                  <div className="flex  items-center gap-[20px]">
                    <PiCertificate className="text-[28px] text-blue-600  " />
                    Cardiology Specialist at Ain Shams University Hospitals
                    (2017 – Present)
                  </div>
                </div>
              </div>
              <BarComp title="Appointment" data={appointmentData} />
            </>
          )}

          {/* Charts */}
          {role === "Patient" && (
            <>
              <ChartComp
                title="Blood Pressure"
                data={data}
                domain={[40, 200]}
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

              <ChartComp
                title="Heart Rate"
                data={heartData}
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
              />

              <ChartComp
                title="Glucose"
                data={glucoseData}
                domain={[40, 180]}
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
            </>
          )}
        </div>
      </div>
    </>
  );
}
