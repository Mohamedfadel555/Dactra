import { IoPersonSharp } from "react-icons/io5";
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import ChartComp from "../../Components/Common/ChartComp";
import profilePhoto from "../../assets/images/profile.webp";
import BarComp from "../../Components/Common/BarComp";
import { useEffect, useState } from "react";
import { GiMedicines } from "react-icons/gi";
import CommentCard from "../../Components/Common/CommentCard";
import { AnimatePresence, motion } from "framer-motion";
import { PiWarningCircle } from "react-icons/pi";
import { FaFileMedicalAlt } from "react-icons/fa";
import DoctorSection from "../../Components/Profile/DoctorSection";
import SwiperComponent from "../../Components/Common/SwiperComponent";
import PatientSection from "../../Components/Profile/PatientSection";
import { IoWarningOutline, IoWarning } from "react-icons/io5";
import { useGetDoctorProfile } from "../../hooks/useGetDoctorProfile";
import { useNavigate, useParams } from "react-router-dom";
import { useGetPatientProfile } from "../../hooks/useGetPatientProfile";
import Schedule from "../../Components/Profile/Schedule";
import { Link } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { useGetUser } from "../../hooks/useGetUser";
import { useGetSlotsById } from "../../hooks/useGetSlotsById";
import ReferralModal from "../../Components/Profile/ReferralModal";
import { MdOutlineScience } from "react-icons/md";
import { HiOutlineBeaker } from "react-icons/hi2";
import { useGetWeeklyAppById } from "../../hooks/useGetWeeklyAppById";
import RatingSection from "./../../Components/Profile/RatingSection";

// ─── helpers ─────────────────────────────────────────────────────────────────

function viewerIdentityFromToken(accessToken) {
  if (!accessToken) return { email: null };
  try {
    const p = JSON.parse(atob(accessToken.split(".")[1]));
    const email = p.email ?? p.unique_name ?? p.preferred_username ?? null;
    return { email };
  } catch {
    return { email: null };
  }
}

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

// ─── component ───────────────────────────────────────────────────────────────

export default function Profile({ role }) {
  const [grouped, setGrouped] = useState([]);
  const [showReferral, setShowReferral] = useState(false);

  const { id } = useParams();
  const { accessToken, role: authRole } = useAuth();
  const { email: viewerEmail } = viewerIdentityFromToken(accessToken);
  const { data: me } = useGetUser();

  const { data: inPersonSlotsToBook } = useGetSlotsById("inPerson", id, role);
  const { data: onlineSlotsToBook } = useGetSlotsById("online", id, role);
  const { data: user, error: userError } =
    role === "Patient" ? useGetPatientProfile(id) : useGetDoctorProfile(id);

  const { data: apptData } = useGetWeeklyAppById(id, role);

  console.log(userError);

  const navigate = useNavigate();

  useEffect(() => {
    if (userError?.response?.status === 403) {
      navigate("/403", { replace: true });
    }
  }, [userError, navigate]);

  const myId = me?.id ?? me?.Id ?? me?.userId ?? me?.UserId;
  const emailMatch =
    viewerEmail &&
    user?.email &&
    String(viewerEmail).toLowerCase() === String(user.email).toLowerCase();

  const authRoleNorm = String(authRole || "").toLowerCase();
  const pageRoleNorm = String(role || "").toLowerCase();
  const routeIsSelf =
    authRoleNorm === pageRoleNorm &&
    myId != null &&
    id != null &&
    String(myId) === String(id);

  const isOwnProfile = Boolean(
    accessToken && user && (emailMatch || routeIsSelf),
  );
  const canRefer =
    accessToken && authRole === "Doctor" && role === "Patient" && !isOwnProfile;

  // vitals transform
  useEffect(() => {
    if (!user || role === "Doctor") return;
    const newg = user.vitalSigns?.reduce((acc, item) => {
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
    setGrouped(newg ?? []);
  }, [user, role]);

  // ─── derived display data ────────────────────────────────────────────────
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
      {/* ── page ── */}
      <div className="min-h-screen bg-[#f8f9fb] font-english pt-[60px]">
        {/* ── Hero banner ─────────────────────────────────────────────────── */}
        <div className="relative h-[200px] md:h-[240px] overflow-hidden">
          {/* abstract mesh bg */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg,#1e3a5f 0%,#185FA5 55%,#0ea5e9 100%)",
            }}
          />
          {/* subtle pattern */}
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

          {/* report / complaint btn */}
          {accessToken && !isOwnProfile && (
            <Link
              to="/complaints/submit"
              state={{ against: role === "Doctor" ? "Doctor" : "Patient" }}
              className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5
                         rounded-full bg-white/15 backdrop-blur-sm border border-white/25
                         text-white text-[12px] font-medium hover:bg-white/25 transition-colors"
            >
              <IoWarning className="size-[14px]" />
              Report
            </Link>
          )}
        </div>

        {/* ── Content ─────────────────────────────────────────────────────── */}
        <div className="px-4 md:px-8 lg:px-12 pb-16 max-w-[1200px] mx-auto">
          {/* ── Profile card (overlaps hero) ──────────────────────────────── */}
          <motion.div variants={fadeUp(0)} initial="hidden" animate="show">
            <Card
              className="relative -mt-[72px] p-5 md:p-6 flex flex-col sm:flex-row
                             items-center sm:items-end gap-5"
            >
              {/* avatar */}
              <motion.div
                className="size-[120px] md:size-[140px] rounded-2xl overflow-hidden
                           bg-gray-100 flex-shrink-0 border-4 border-white shadow-lg"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 260 }}
              >
                {user?.imageUrl || user?.profileImageUrl ? (
                  <div
                    className="size-[120px] md:size-[140px] rounded-2xl overflow-hidden border-4 border-white shadow-lg"
                    style={{
                      backgroundImage: `url(${user.imageUrl || user.profileImageUrl})`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "top",
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-end justify-center overflow-hidden">
                    <IoPersonSharp className="text-[100px] text-gray-400 translate-y-3" />
                  </div>
                )}
              </motion.div>

              {/* name + contact */}
              <div
                className="flex-1 flex flex-col sm:flex-row sm:items-end
                              justify-between gap-4 w-full"
              >
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

                {/* referral button */}
                {canRefer && (
                  <motion.button
                    onClick={() => setShowReferral(true)}
                    whileHover={{
                      y: -2,
                      boxShadow: "0 8px 24px rgba(24,95,165,.25)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="self-start sm:self-auto flex items-center gap-2 px-5 py-2.5
                               rounded-xl bg-blue-600 text-white text-[13px] font-semibold
                               hover:bg-blue-700 transition-colors shadow-md shadow-blue-200/60"
                  >
                    <motion.span
                      animate={{ rotate: [0, 12, -12, 0] }}
                      transition={{
                        duration: 2.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <HiOutlineBeaker size={17} />
                    </motion.span>
                    Send lab referral
                  </motion.button>
                )}
              </div>
            </Card>
          </motion.div>

          {/* ── Two-column grid ───────────────────────────────────────────── */}
          <div className="mt-5 flex flex-col lg:flex-row gap-5 items-start">
            {/* ── Left sidebar ──────────────────────────────────────────── */}
            <motion.div
              className="w-full lg:w-[300px] flex flex-col gap-4 flex-shrink-0"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              {/* Stats */}
              <motion.div variants={itemFade}>
                <Card className="p-5">
                  <p
                    className="text-[11px] font-semibold text-gray-400 uppercase
                                 tracking-wider mb-4"
                  >
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
                    <p
                      className="text-[11px] font-semibold text-gray-400 uppercase
                                   tracking-wider mb-4"
                    >
                      Medical reports
                    </p>
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
                          className="flex items-center gap-2.5 p-2.5 rounded-xl
                                     hover:bg-blue-50 transition-colors cursor-pointer group"
                        >
                          <div
                            className="size-8 rounded-lg bg-blue-50 group-hover:bg-blue-100
                                          flex items-center justify-center transition-colors flex-shrink-0"
                          >
                            <FaFileMedicalAlt className="text-blue-500 size-[14px]" />
                          </div>
                          <span className="text-[13px] text-gray-700 font-medium">
                            {r} Report
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Allergies + Chronics (patient only, sidebar on desktop) */}
              {role === "Patient" && (
                <>
                  <motion.div variants={itemFade}>
                    <PatientSection
                      Icon={PiWarningCircle}
                      title="Allergies"
                      data={user?.allergies}
                      editFlag={false}
                    />
                  </motion.div>
                  <motion.div variants={itemFade}>
                    <PatientSection
                      Icon={GiMedicines}
                      title="Chronic diseases"
                      data={user?.chronicDiseases}
                      editFlag={false}
                    />
                  </motion.div>
                </>
              )}
            </motion.div>

            {/* ── Right main ────────────────────────────────────────────── */}
            <motion.div
              className=" w-full md:flex-1 min-w-0 flex flex-col gap-4"
              variants={stagger}
              initial="hidden"
              animate="show"
            >
              {/* Doctor sections */}
              {role === "Doctor" && (
                <>
                  {/* About */}
                  <motion.div variants={itemFade}>
                    <Card className="p-5">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
                        About
                      </p>
                      <p className="text-[14px] text-gray-600 leading-relaxed">
                        {user?.about ?? "No description available."}
                      </p>
                    </Card>
                  </motion.div>

                  <motion.div variants={itemFade}>
                    <DoctorSection
                      title="Qualifications"
                      info={user?.qualifications}
                      editFlag={false}
                    />
                  </motion.div>

                  <motion.div variants={itemFade}>
                    <DoctorSection title="Experience" editFlag={false} />
                  </motion.div>

                  <motion.div variants={itemFade}>
                    <Card className="p-5">
                      <Schedule
                        title="Appointment booking"
                        subtitle="Select appointment"
                        role="NOt a doctor"
                        timeSlots={{
                          inPerson: inPersonSlotsToBook ?? [],
                          online: onlineSlotsToBook ?? [],
                        }}
                        id={id}
                      />
                    </Card>
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
                      editFlag={false}
                    />
                  </motion.div>
                ))}
            </motion.div>
          </div>

          {/* ── Doctor ratings ─────────────────────────────────────────────── */}
          {role === "Doctor" && authRole === "Patient" && (
            <motion.div
              className="mt-5"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.48, ease: "easeOut", delay: 0.2 }}
            >
              <RatingSection
                providerId={id}
                canRate={
                  !!accessToken && authRole === "Patient" && !isOwnProfile
                }
              />
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Referral modal ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showReferral && (
          <ReferralModal
            patientId={id}
            onClose={() => setShowReferral(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
