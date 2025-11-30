import { HiChevronRight } from "react-icons/hi";
import { HiStar } from "react-icons/hi";
import qoutes from "../../assets/images/Vector3.webp";
import sir from "../../assets/images/magdy.webp";
import vec from "../../assets/images/Vector1.webp";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut", delay: 0.15 },
  },
};

export default function HeroSection({ Role = "Patient" }) {
  return (
    <div className="flex flex-col md:flex-row gap-10 justify-center relative items-center w-full px-5 md:px-[50px]">
      {/* LEFT SIDE */}

      <img
        loading="lazy"
        alt="background photo"
        src={vec}
        className="absolute top-[20%] md:top-[40%] z-20 "
      />

      <motion.div
        className="flex-1 flex flex-col gap-6 justify-center items-center md:justify-start md:items-stretch text-center md:text-left"
        variants={fadeUp}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
      >
        <h1 className="text-[26px] leading-[32px] md:text-[34px] md:leading-[34px] lg:text-[50px] xl:text-[60px] max-w-[550px] lg:leading-16 font-bold">
          Your <span className="gradient-text">trusted partner</span>
          {Role === "Patient" || Role === null
            ? " in digital healthcare."
            : " in buildinga smarter medical practice"}
        </h1>

        <p className="font-semibold text-[13px] sm:text-[14px] xl:text-xl max-w-[350px] md:max-w-full">
          <span className="gradient-text">
            {Role === "Patient" || Role === null
              ? "Empowering Your Health at Every Step."
              : "Take your medical career to the next level."}
          </span>
          {Role === "Patient" || Role === null
            ? "Experience personalized medical care from the comfort of your home.Connect with"
            : "Easily organize appointments, engage with Patients through posts, publish helpful articles, and build trust with verified ratings. Everything you need to manage and grow your practice,"}
          <span className="gradient-text">
            {Role === "Patient" || Role === null
              ? "certified doctors"
              : " all in one place."}
          </span>
          {Role === "Patient" || Role === null
            ? ", or manage prescriptions, and schedule appointments with ease. Ready to take control of your health?"
            : "Stay in control of your schedule—"}
          <span className="gradient-text">
            {Role === "Patient" || Role === null
              ? " Get Started "
              : "Check your appointment."}
          </span>{" "}
          {Role === "Patient" || Role === null
            ? "or Book an Appointment today."
            : ""}
        </p>

        <button
          type="button"
          className="font-semibold relative z-30 w-[80%] sm:w-[60%] md:w-[60%] md:h-[50px] lg:text-xl xl:text-2xl text-white h-[46px] bg-[linear-gradient(141deg,#A7E2FF,#316BE8)] rounded-2xl flex justify-center items-center"
        >
          {Role === "Patient" || Role === null
            ? "Book an appointment"
            : "Check your appointments"}
          <HiChevronRight className="text-xl md:text-2xl lg:text-3xl ml-1" />
        </button>
      </motion.div>

      <motion.div
        className="flex-1 md:flex md:h-[400px] lg:h-[450px] hidden justify-center items-end"
        variants={fadeRight}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.25 }}
      >
        <div
          className="md:w-[90%] md:h-[87%] lg:w-[75%] xl:w-[65%] lg:h-[80%] xl:h-[100%] relative bg-[linear-gradient(0deg,#A7E2FF_29%,#316BE8)]"
          style={{
            borderTopRightRadius: "50%",
            borderTopLeftRadius: "50%",
            borderBottomLeftRadius: "20px",
            borderBottomRightRadius: "20px",
          }}
        >
          <img
            src={sir}
            alt="Hero image"
            loading="lazy"
            className="absolute bottom-0 w-full left-[25%] translate-x-[-40%]"
          />
          <div className="text-[#0069AB] z-30 md:text-[10px] lg:text-[14px] xltext-[18px] flex absolute top-2/3 -left-1/4 shadow-[5px_6px_10px_#b7b7b7] w-fit gap-1.5 justify-center items-center px-[10px] py-[4px] bg-white rounded-[10px]">
            <HiStar className="bg-[#EFF9FF] text-[20px] " />
            <p>
              {Role === "Patient" || Role === null
                ? "Easy Appointment Booking"
                : "Seamless Appointment Management"}
            </p>
          </div>
          <div className="text-[#3D3D3D] z-30 md:text-[10px] md:w-[185px] lg:text-[14px] xl:text-[18px] relative lg:w-[250px] xl:w-[300px] top-[92%] left-[55%] right-[-30%] px-[20px] pb-[10px] pt-[20px] bg-[#E9F6FF] border-2 border-[#95DDFF] rounded-[10px] shadow-[5px_6px_10px_#b7b7b7]">
            <img
              src={qoutes}
              loading="lazy"
              alt="quotes"
              className="absolute left-[10%] md:w-[30%] lg:w-[60px] xl:w-[70px] top-[-26%]"
            />
            <p>
              {Role === "Patient" || Role === null
                ? "Easily manage your appointments and stay connected with your doctor anytime."
                : "Organize your schedule with ease and stay connected with your Patients anytime"}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
