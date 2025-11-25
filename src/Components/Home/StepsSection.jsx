import { motion } from "framer-motion";
import vector from "../../assets/images/Vector.webp";
import Group from "../../assets/images/Group27.webp";
import doctor from "../../assets/images/doctor.webp";
const patientSteps = [
  {
    header: "Create Your Profile",
    desc: "Sign up and fill in your medical history securely. Setting up your profile this way would ensure that you stay up-to-date with your medical processes.",
  },
  {
    header: "Choose Your Service",
    desc: "Select from our range of services and book a consultation. Booking a consultation with HealNet is fairly simple and straight-forward.",
  },
  {
    header: "Meet Your Doctor",
    desc: "Have a virtual consultation with one of our certified specialists, or go for a physical visit to the doctor in case you opted for a physical check-up.",
  },
];
const providerSteps = [
  {
    header: "Create Your Profile",
    desc: "Sign up and set up your clinic, lab, or pharmacy profile. Showcase your services, certifications, and working hours to be discoverable by patients.",
  },
  {
    header: "List Your Services",
    desc: "Add all the services you provide—consultations, lab tests, radiology scans, prescriptions—and manage availability to make booking seamless.",
  },
  {
    header: "Connect with Patients",
    desc: "Receive bookings, e-prescriptions, and patient requests directly. Communicate efficiently and grow your practice by providing timely, professional care.",
  },
];

// animation variants
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18, // الفرق الزمني بين كل خطوة والتانية
    },
  },
};

const itemVariants = {
  hidden: { x: -60, opacity: 0 }, // ييجي من الشمال
  show: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 16,
    },
  },
};

export default function StepsSection({ Role }) {
  return (
    <div className="flex flex-col lg:flex-row w-[90%]  lg:w-[70%] justify-between gap-[120px] lg:gap-[30px] items-center">
      {/* هنا غيرت الـdiv اللي فيها الماب ل motion.div بس نفس كل الـclasses */}
      <motion.div
        className="flex flex-col gap-[15px]"
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.5 }}
      >
        {(Role === "patient" || Role === null
          ? patientSteps
          : providerSteps
        ).map((step, index) => (
          // كل ستب ملفوفة بـ motion.div عشان تعمل slide-in مع stagger
          <motion.div
            key={index}
            className="flex gap-[20px] w-full lg:max-w-[400px]"
            variants={itemVariants}
          >
            <div className="flex justify-center items-start">
              <div className=" size-[40px] text-[20px] md:size-[60px] rounded-full text-[30px]  hover-gradient text-white font-bold flex justify-center items-center">
                {++index}
              </div>
            </div>
            <div className="pt-[10px] flex flex-col gap-[10px] ">
              <h2 className=" text-[20px] md:text-[30px] text-[#3D3D3D] font-bold">
                {step.header}
              </h2>
              <p className="text-[#6D6D6D] text-[14px] md:text-[18px]">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className=" size-[250px] md:size-[300px] relative  bg-[linear-gradient(140deg,white_29%,#C0EAFF)] rounded-[20px] border-2 border-blue-300  ">
        <img
          src={Group}
          loading="lazy"
          alt="design photo"
          className="w-[100px]  md:w-[150px] absolute right-[-20%] md:right-[-30%] top-[-10%] "
        />
        <img
          src={vector}
          alt="design photo"
          className="w-[80px] md:w-[100px] absolute right-[-18%] md:right-[-33%] top-[-18%] "
        />
        <img
          src={doctor}
          alt="doctor photo"
          className=" w-[150%] md:w-[200%] object-none h-[350px] md:h-[400px] absolute left-0 bottom-0 "
        />
      </div>
    </div>
  );
}
