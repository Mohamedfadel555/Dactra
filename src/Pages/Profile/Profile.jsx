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
import AvatarIcon from "../../Components/Common/AvatarIcon1";
import { GiMedicines } from "react-icons/gi";
import { Form, Formik } from "formik";
import FormInputField from "../../Components/Auth/FormInputField";
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
import ReviewsDetailsSection from "../../Components/Common/ReviewsDetailsSection";
import SwiperComponent from "../../Components/Common/SwiperComponent";
import { useGetMyAllergies } from "../../hooks/useGetMyAllergies";
import { useGetMyChronic } from "../../hooks/useGetMyChronic";
import PatientSection from "../../Components/Profile/PatientSection";
import { useGetAllAllergies } from "../../hooks/useGetAllAllergies";
import { useGetAllChronic } from "../../hooks/useGetAllChronic";
import { useEditAllergies } from "../../hooks/useEditAllergies";
import { useEditChronics } from "../../hooks/useEditChronics";
import { IoWarningOutline } from "react-icons/io5";
import { useGetDoctorProfile } from "../../hooks/useGetDoctorProfile";
import { useParams } from "react-router-dom";
import { useGetPatientProfile } from "../../hooks/useGetPatientProfile";
import Schedule from "../../Components/Profile/Schedule";

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

export default function Profile({ role }) {
  const [edit, setEdit] = useState(false);
  const [changePass, setchangePass] = useState(false);
  const [deleteAcc, setDeleteAcc] = useState(false);
  const [grouped, setGrouped] = useState([]);
  const { id } = useParams();

  const { data: user } =
    role === "Patient" ? useGetPatientProfile(id) : useGetDoctorProfile(id);
  console.log(role);
  console.log(user);

  //transforming vitals data
  useEffect(() => {
    if (!user || role === "Doctor") return;
    let newg = user?.vitalSigns.reduce((acc, item) => {
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
  }, [user]);

  console.log(grouped);

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
        (key) => (values[key] = Number(values[key])),
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

  const rightContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.05,
      },
    },
  };

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

  const sidebarContainer = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.04,
      },
    },
  };

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
      <div className="flex flex-col gap-[70px] justify-center pb-[50px]">
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
            </motion.div>
            {role === "Patient" && (
              <motion.div
                variants={sidebarItem}
                className=" relative  flex flex-col  
          gap-[20px] p-[16px] rounded-[10px] bg-white shadow-md"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl ">Medical Reports Archieve </h3>
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
                      </div>
                    ))
                  ) : (
                    <div className="flex gap-2">
                      <IoWarningOutline className="text-blue-600 size-[30px] shrink-0" />
                      <div className="flex flex-col gap-1 max-w-[250px]">
                        <p className="font-bold">No medical reports yet</p>
                        <p className="text-[12px]">
                          This Patient has not shared Medical reports yet
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
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
                      : "The doctor has not shared an about section yet"}
                  </p>
                </motion.div>

                <motion.div variants={rightItem} className="w-full">
                  <DoctorSection
                    title={"Qualifications"}
                    info={user && user.qualifications}
                    editFlag={false}
                  />
                </motion.div>

                <motion.div variants={rightItem} className="w-full">
                  <DoctorSection title={"Experience"} editFlag={false} />
                </motion.div>
                <motion.div
                  variants={rightItem}
                  className="w-full bg-white shadow-md rounded-xl p-4 md:p-5"
                >
                  <Schedule
                    title={"Appointment booking"}
                    subtitle={"Select time slot"}
                    timeSlots={{
                      "28/1/2026": [
                        "4:00 pm",
                        "5:00 pm",
                        "7:00 pm",
                        "10:00 pm",
                        "11:00 pm",
                        "12:00 pm",
                      ],
                      "29/1/2026": [
                        "2:00 pm",
                        "3:00 pm",
                        "6:00 pm",
                        "8:00 pm",
                        "9:00 pm",
                      ],
                      "21/1/2026": [
                        "3:00 pm",
                        "4:00 pm",
                        "6:00 pm",
                        "8:00 pm",
                        "9:00 pm",
                      ],
                      "22/1/2026": [
                        "1:00 pm",
                        "2:00 pm",
                        "4:00 pm",
                        "6:00 pm",
                        "10:00 pm",
                      ],
                      "23/1/2026": [
                        "5:00 pm",
                        "7:00 pm",
                        "9:00 pm",
                        "11:00 pm",
                      ],
                      "24/1/2026": [
                        "2:00 pm",
                        "4:00 pm",
                        "6:00 pm",
                        "8:00 pm",
                        "9:00 pm",
                      ],
                      "25/1/2026": [
                        "3:00 pm",
                        "5:00 pm",
                        "7:00 pm",
                        "9:00 pm",
                        "10:00 pm",
                      ],
                    }}
                  />
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
                      data={user && user.allergies}
                      editFlag={false}
                    />

                    <PatientSection
                      Icon={GiMedicines}
                      title={"Chronic Diseases"}
                      data={user && user.chronicDiseases}
                      editFlag={false}
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
                    editFlag={false}
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
                    editFlag={false}
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
                    editFlag={false}
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
              {user?.ratings && (
                <>
                  {/* <motion.div
                    variants={rightItem}
                    initial={{ opacity: 0, x: 80 }}
                    animate={{ opacity: 1, x: 0 }}
                    className=""
                  >
                    {/* <ReviewsDetailsSection
                      NumOfReviews={ratings && ratings.totalRatings}
                      avgRating={ratings && ratings.averageRating}
                      addFlag={false}
                      data={
                        ratings
                          ? ratings.scoreCounts
                          : [
                              { num: 1, percent: 0 },
                              { num: 2, percent: 0 },
                              { num: 3, percent: 0 },
                              { num: 4, percent: 0 },
                              { num: 5, percent: 0 },
                            ]
                      }
                    />
                  </motion.div> */}

                  {user.ratings?.length > 0 && (
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
