import { RiVidiconLine } from "react-icons/ri";
import { ImLab } from "react-icons/im";
import { GiRadioactive } from "react-icons/gi";
import { FaHandHoldingMedical, FaStar } from "react-icons/fa";
import { motion } from "framer-motion";
import HeaderSection from "./../Components/Home/HeaderSection";
import HeroSection from "../Components/Home/HeroSection";
import ServiceCard from "../Components/Home/ServiceCard";
import { FaUserDoctor } from "react-icons/fa6";
import { GiLabCoat } from "react-icons/gi";
import { FaXRay } from "react-icons/fa";
import { HiChevronRight } from "react-icons/hi";
import communityImg from "../assets/images/community.webp";
import pharmacyImg from "../assets/images/pharmacy.webp";
import profilePhoto from "../assets/images/profile.webp";

import StepsSection from "../Components/Home/StepsSection";
import DoctorCard from "../Components/Common/DoctorCard";
import vDoctor from "../assets/images/doctorvideo.webp";
import vCustomer from "../assets/images/customervideo.webp";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useMajors } from "../hooks/useMajors";
import SpecialistCard from "../Components/Home/SpecialistCard";
import BrandLogo from "./../Components/Common/BrandLogo";
import { Link } from "react-router-dom";
import Bar from "../Components/Common/ReviewBar";
import CommentCard from "./../Components/Common/CommentCard";
import ServicesPricingSection from "./../Components/Home/ServicesPricingSection";
import StatisticsSection from "./../Components/Home/StatisticsSection";
import PlatformFeaturesSection from "./../Components/Home/PlatformFeaturesSection";
import FAQAccordion from "./../Components/Home/FAQAccordion";
import { useAuth } from "../Context/AuthContext";
import axios from "axios";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const sectionFade = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      duration: 0.6,
    },
  },
};

const doctors = [
  {
    name: "Mohamed Ahmed",
    specialist: "Cardiac",
    rating: "4.9",
    ratingNo: "320",
    isFavourite: true,
  },
  {
    name: "Sara Ali",
    specialist: "Neurology",
    rating: "4.8",
    ratingNo: "280",
    isFavourite: false,
  },
  {
    name: "Khaled Hassan",
    specialist: "Orthopedic",
    rating: "5.0",
    ratingNo: "410",
    isFavourite: true,
  },
  {
    name: "Noura Mahmoud",
    specialist: "Pediatric",
    rating: "4.7",
    ratingNo: "195",
    isFavourite: false,
  },
  {
    name: "Omar Tarek",
    specialist: "Dermatology",
    rating: "4.9",
    ratingNo: "367",
    isFavourite: true,
  },
  {
    name: "Laila Salem",
    specialist: "Gynecology",
    rating: "4.8",
    ratingNo: "290",
    isFavourite: false,
  },
  {
    name: "Hossam Reda",
    specialist: "Cardiac",
    rating: "4.9",
    ratingNo: "450",
    isFavourite: true,
  },
  {
    name: "Hossam Reda",
    specialist: "Cardiac",
    rating: "4.9",
    ratingNo: "450",
    isFavourite: true,
  },
  {
    name: "Hossam Reda",
    specialist: "Cardiac",
    rating: "4.9",
    ratingNo: "450",
    isFavourite: true,
  },
  {
    name: "Hossam Reda",
    specialist: "Cardiac",
    rating: "4.9",
    ratingNo: "450",
    isFavourite: true,
  },
];
const comments = [
  {
    name: "Mohamed Fadel",
    photo: profilePhoto,
    starsNo: 5,
    heading: "Excellent Service!",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor in reprehenderit in voluptate velit esse.",
  },
  {
    name: "Sara Ahmed",
    photo: profilePhoto,
    starsNo: 4,
    heading: "Great Work!",
    body: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    name: "Omar Ali",
    photo: profilePhoto,
    starsNo: 3,
    heading: "Good Experience",
    body: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
  },
  {
    name: "Nour Hassan",
    photo: profilePhoto,
    starsNo: 5,
    heading: "Amazing!",
    body: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.",
  },
  {
    name: "Youssef Adel",
    photo: profilePhoto,
    starsNo: 2,
    heading: "Could Be Better",
    body: "Et harum quidem rerum facilis est et expedita distinctio nam libero tempore cum soluta nobis est.",
  },
  {
    name: "Laila Samir",
    photo: profilePhoto,
    starsNo: 4,
    heading: "Loved It!",
    body: "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet.",
  },
  {
    name: "Hana Mohamed",
    photo: profilePhoto,
    starsNo: 5,
    heading: "Perfect!",
    body: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur.",
  },
  {
    name: "Karim Essam",
    photo: profilePhoto,
    starsNo: 3,
    heading: "Nice Job",
    body: "Nisi ut aliquid ex ea commodi consequatur quis autem vel eum iure reprehenderit.",
  },
  {
    name: "Mariam Reda",
    photo: profilePhoto,
    starsNo: 4,
    heading: "Very Good!",
    body: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
  },
  {
    name: "Mostafa Khaled",
    photo: profilePhoto,
    starsNo: 5,
    heading: "Fantastic Work!",
    body: "Vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
  },
];

export default function HomePageForPatient() {
  const { role } = useAuth();
  const {
    data: majors,
    isLoading: majorsLoading,
    isError: majorsError,
  } = useMajors("doctor");

  const test = async () => {
    try {
      const res = await axios.post(
        "https://dactra.runasp.net/api/account/refresh",
        {},
        {
          withCredentials: true,
        }
      );
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  test();

  return (
    <div className="w-full flex flex-col gap-[100px] lg:gap-[200px] pt-[100px] md:pt-[70px] font-english bg-[linear-gradient(145deg,#aec0ff_-50%,transparent_17%)]">
      {/* Section1 */}
      <HeroSection Role={role} />

      {/* Section2 - Services */}
      {role === "Patient" || role === null ? (
        <div className="flex flex-col gap-8 justify-center items-center relative z-40 px-4">
          <HeaderSection
            leftText="Top"
            gradientText="services"
            rightText="we offer"
            description="In today’s fast-paced world, your health deserves the utmost attention and convenience. That’s why Dactra offers a suite of integrated services designed to cater to your healthcare needs digitally:"
          />

          <div className="flex flex-col gap-6 w-full lg:w-[70%] flex-wrap mx-auto">
            {/* Row 1 */}
            <div className="w-full flex flex-col md:flex-row gap-6">
              <ServiceCard
                icon={RiVidiconLine}
                header="Doctor Consultations"
                desc="Provide specialized medical consultations to patients through video. Manage your daily schedule with an easy, flexible booking system designed to help you organize appointments and enhance patient experience."
                Big={true}
              />
              <ServiceCard
                Big={false}
                icon={ImLab}
                header={"Medical Scans"}
                desc="Find the nearest lab tests quickly and easily, check patient reviews, and book your tests with confidence"
              />
            </div>

            {/* Row 2 */}
            <div className="w-full flex flex-col md:flex-row-reverse gap-6">
              <ServiceCard
                icon={FaHandHoldingMedical}
                header="Prescription Finder"
                desc="Find the Right Pharmacy Fast. <br /> Search for your prescribed medicines and instantly see which nearby pharmacies have them available, so you can get your medication without delays."
                Big={true}
              />
              <ServiceCard
                Big={false}
                icon={GiRadioactive}
                header="Radiology"
                desc="Discover nearby radiology centers, see patient ratings, and choose the best place for accurate and fast scans"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8 justify-center items-center relative z-40 px-4">
          <HeaderSection
            leftText="Empowering"
            gradientText="Healthcare"
            rightText="Providers"
            description="Manage your appointments, streamline your workflow, and connect with patients efficiently. Dactra gives you the digital tools to focus on what matters most – providing excellent care"
          />

          <div className="flex flex-col gap-6 w-full lg:w-[70%] flex-wrap mx-auto">
            {/* Row 1 */}
            <div className="w-full flex flex-col md:flex-row gap-6">
              {/* Doctor Consultations */}
              <ServiceCard
                icon={FaUserDoctor}
                header="Doctors"
                desc="Online Consultations Made Easy
Open your virtual clinic and reach new patients daily — no rent or staff needed. Set your own schedule & fees, get paid instantly, write articles, answer questions, and access full patient history securely."
              />
              <ServiceCard
                Big={false}
                icon={GiLabCoat}
                header={"Medical Labs"}
                desc={
                  "Get noticed by patients instantly. Top-rated labs appear first, connect directly, and gain more customers without ads."
                }
              />
            </div>

            {/* Row 2 */}
            <div className="w-full flex flex-col md:flex-row-reverse gap-6">
              {/* Prescription Finder */}
              <ServiceCard
                icon={FaHandHoldingMedical}
                header="Radiology"
                desc="Attract Scan Patients Automatically
We recommend your center to patients looking for X-ray, MRI, CT, or ultrasound nearby. Ranked by genuine reviews + proximity. Patients view prices, photos & ratings and choose you — daily new cases with no marketing effort."
              />
              {/* Radiology */}
              <ServiceCard
                Big={false}
                icon={FaXRay}
                header="Pharmacies"
                desc="Get instant prescription alerts, connect with patients, and boost sales with in-stock medicines and delivery options."
              />
            </div>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="flex flex-col gap-8 justify-center items-center px-0 md:px-4">
        <HeaderSection
          leftText="How"
          gradientText="our platform"
          rightText="works"
          description="Navigating your healthcare journey with Dactra is seamless. Just follow these steps mentioned below to proceed with your selected services. You can also see our FAQ section for more guidance:"
        />
        <StepsSection Role={role} />
      </div>

      {(role === "Patient" || role === null) && (
        <>
          <div className="flex flex-col gap-12 justify-center items-center px-4 md:px-8 lg:px-12">
            <HeaderSection
              leftText="Our"
              rightText="Doctors"
              gradientText="Top Rated"
              description="Meet our top-rated doctors, trusted by patients for their expertise and exceptional care"
            />

            <div className="w-full max-w-screen-2xl mx-auto">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 24 },
                  768: { slidesPerView: 2, spaceBetween: 30 },
                  1024: { slidesPerView: 3, spaceBetween: 30 },
                  1280: { slidesPerView: 4, spaceBetween: 32 },
                }}
                navigation={{
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
                }}
                pagination={{
                  clickable: true,
                  el: "#custom-swiper-pagination1",
                  bulletClass: "custom-bullet",
                  bulletActiveClass: "custom-bullet-active",
                }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
                loop={true}
                grabCursor={true}
                className="!overflow-visible pb-20"
              >
                {doctors.map((doc, index) => (
                  <SwiperSlide key={index}>
                    <motion.div
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: false, margin: "-100px" }}
                      variants={fadeUp}
                      className="flex justify-center"
                    >
                      <DoctorCard
                        name={doc.name}
                        specialist={doc.specialist}
                        rating={doc.rating}
                        ratingNo={doc.ratingNo}
                        isFavourite={doc.isFavourite}
                      />
                    </motion.div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div
                id="custom-swiper-pagination1"
                className=" flex justify-center gap-3 mt-10"
              ></div>

              <div className="flex justify-center gap-6 mt-12">
                <button
                  type="button"
                  className="swiper-button-prev-custom bg-white shadow-xl hover:shadow-2xl w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border border-gray-200 z-10"
                >
                  <svg
                    className="w-7 h-7 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  className="swiper-button-next-custom bg-white shadow-xl hover:shadow-2xl w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border border-gray-200 z-10"
                >
                  <svg
                    className="w-7 h-7 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-12 justify-center items-center px-4 md:px-8 lg:px-12">
            <HeaderSection
              leftText="Top Our"
              gradientText=" Expert Specialties"
              rightText="For Your Health"
              description="Top-rated specialists in Cardiac, Neurology, Orthopedics, Pediatrics, Dermatology & more — all verified, highly reviewed, and ready to help you today."
            />
            <div className="flex gap-[15px] justify-center items-center flex-wrap">
              {majors?.map((major, ind) => (
                <SpecialistCard name={major.name} icon={major.iconPath} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-12 justify-center items-center">
            <HeaderSection
              leftText="Instant"
              gradientText="Online Consultations"
              rightText="with our Doctors"
              description="Get instant medical help from our top-rated doctors online - Your health matters"
            />

            <div className="px-1.5 w-full flex flex-col lg:flex-row justify-center items-center gap-[50px] mt-[50px] py-[50px] bg-[linear-gradient(0deg,#9FBDFF,transparent)]">
              <motion.div
                className="flex flex-col gap-[50px] justify-center text-center lg:text-left"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <p className="text-[24px] md:text-[30px] text-[#1B3C82] font-semibold md:max-w-[500px] lg:max-w-[350px] mx-auto lg:mx-0">
                  Your health matters — consult with experienced doctors online,
                  receive expert guidance, and take care of yourself without the
                  hassle of clinic visits
                </p>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05, backgroundColor: "#1D5EDB" }}
                  className="w-[200px] flex justify-center items-center gap-[5px] h-[50px] rounded-xl bg-[#316BE8] text-[20px] font-bold text-white mx-auto lg:mx-0"
                >
                  Book Now <HiChevronRight className="text-[24px] font-bold" />
                </motion.button>
              </motion.div>

              <motion.div
                className="w-full lg:w-1/2 relative"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
              >
                <img
                  src={vDoctor}
                  alt="photo for doctor in video"
                  loading="lazy"
                  className="w-full rounded-[24px]"
                />
                <motion.img
                  src={vCustomer}
                  alt="customer video"
                  className="w-[30%] absolute right-2.5 top-2.5 rounded-[18px]"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </motion.div>
            </div>
          </div>

          <motion.div
            variants={sectionFade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col gap-[50px] md:gap-[100px] justify-center items-center"
          >
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center gap-12 px-4 md:px-8 lg:px-16"
            >
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 w-full max-w-7xl">
                <div className="flex flex-col gap-6 lg:w-1/2 text-center lg:text-left">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#3D3D3D]">
                    Join Our
                    <span className="gradient-text block">
                      Medical Community
                    </span>
                  </h2>
                  <p className="text-[18px] sm:text-[20px] font-bold">
                    Share your medical questions and get answers from vetted
                    doctors, or browse expert articles to stay informed about
                    the latest health information.
                  </p>
                  <p className="text-[18px] sm:text-[20px] font-bold">
                    Ask. Learn. Share.
                  </p>

                  <div className="flex flex-row flex-wrap justify-center lg:justify-start gap-4 mt-4">
                    <button
                      type="button"
                      className="bg-[#316BE8] text-white text-[20px] sm:text-[24px] font-bold w-[200px] h-[60px] rounded-xl"
                    >
                      Ask a Question
                    </button>
                    <button
                      type="button"
                      className="bg-white text-[#316BE8] border-2 border-[#316BE8] text-[20px] sm:text-[24px] font-bold w-[200px] h-[60px] rounded-xl"
                    >
                      Read Articles
                    </button>
                  </div>
                </div>

                <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                  <img
                    src={communityImg}
                    alt="community image"
                    loading="lazy"
                    className="w-full max-w-md lg:max-w-full rounded-xl"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center gap-12 px-4 md:px-8 lg:px-16"
            >
              <div className="flex flex-col-reverse lg:flex-row items-center gap-10 w-full max-w-7xl">
                <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                  <img
                    src={pharmacyImg}
                    loading="lazy"
                    alt="delivery image"
                    className="w-full max-w-md lg:max-w-full rounded-xl"
                  />
                </div>

                <div className="flex flex-col gap-6 lg:w-1/2 text-center lg:text-left">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#3D3D3D]">
                    Find Your
                    <span className="gradient-text block">Medicine Easily</span>
                  </h2>
                  <p className="text-[18px] sm:text-[20px] font-bold">
                    Our system helps you check where your prescribed medecine
                    are available across nearby pharmacies
                  </p>

                  <div className="flex justify-center items-center md:block">
                    <button
                      type="button"
                      className="bg-[#316BE8] text-white text-[20px] sm:text-[24px] font-bold w-[200px] h-[60px] rounded-xl"
                    >
                      Try It Out
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className=" w-full flex flex-col gap-12 justify-center items-center">
              <HeaderSection
                leftText={"What People Think"}
                gradientText={"About Us"}
              />
              <motion.div
                variants={fadeUp}
                className="w-[80%] m-auto flex flex-col justify-center items-center gap-10"
              >
                <div
                  className="w-full flex flex-col gap-5 justify-center items-center 
    shadow-[0_4px_25px_rgba(0,0,0,0.08)] rounded-2xl p-6 sm:p-8 bg-white"
                >
                  <div className="flex flex-col sm:flex-row w-full justify-between items-center gap-4 sm:gap-0">
                    <BrandLogo />
                    <Link className="text-[16px] sm:text-[20px] text-[#567CFE] font-bold">
                      Add Reviews+
                    </Link>
                  </div>

                  <div className="flex flex-col md:flex-row w-full justify-between items-center gap-8 md:gap-[100px] mt-4">
                    {/* Bar Ratings */}
                    {/* Bar Ratings */}
                    <div className="md:flex-3 flex flex-col justify-between items-center w-full md:w-[300px] lg:w-[400px]">
                      <Bar number={1} percent={30} />
                      <Bar number={2} percent={40} />
                      <Bar number={3} percent={10} />
                      <Bar number={4} percent={60} />
                      <Bar number={5} percent={70} />
                    </div>

                    {/* Overall Rating */}
                    <div className="flex flex-col justify-center items-center gap-2 md:gap-4">
                      <h2 className="text-[60px] sm:text-[80px] md:text-[100px] font-bold">
                        5.0
                      </h2>
                      <div className="flex justify-center items-center gap-1 sm:gap-2">
                        <FaStar className="text-[#EAB308] text-[16px] sm:text-[18px]" />
                        <FaStar className="text-[#EAB308] text-[16px] sm:text-[18px]" />
                        <FaStar className="text-[#EAB308] text-[16px] sm:text-[18px]" />
                        <FaStar className="text-[#EAB308] text-[16px] sm:text-[18px]" />
                        <FaStar className="text-[#EAB308] text-[16px] sm:text-[18px]" />
                      </div>
                      <p className="text-[#868686] text-[14px] sm:text-[16px] mt-1 sm:mt-2">
                        500 reviews
                      </p>
                    </div>
                  </div>
                </div>

                <div className=" pb-[30px] overflow-hidden w-full max-w-screen-2xl mx-auto">
                  <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={30}
                    slidesPerView={1}
                    breakpoints={{
                      640: { slidesPerView: 2, spaceBetween: 24 },
                      768: { slidesPerView: 2, spaceBetween: 30 },
                      1024: { slidesPerView: 3, spaceBetween: 30 },
                      1280: { slidesPerView: 3, spaceBetween: 32 },
                    }}
                    navigation={{
                      nextEl: ".swiper-button-next-custom",
                      prevEl: ".swiper-button-prev-custom",
                    }}
                    pagination={{
                      clickable: true,
                      el: "#custom-swiper-pagination",
                      bulletClass: "custom-bullet",
                      bulletActiveClass: "custom-bullet-active",
                    }}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    loop={true}
                    grabCursor={true}
                    className="!overflow-visible pb-20"
                  >
                    {comments.map((comment, index) => (
                      <SwiperSlide key={index}>
                        <motion.div
                          initial="hidden"
                          whileInView="show"
                          viewport={{ once: false, margin: "-100px" }}
                          variants={fadeUp}
                          className="flex justify-center"
                        >
                          <CommentCard
                            name={comment.name}
                            photo={comment.photo}
                            starsNo={comment.starsNo}
                            heading={comment.heading}
                            body={comment.body}
                          />
                        </motion.div>
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  <div
                    id="custom-swiper-pagination"
                    className=" flex justify-center gap-3 mt-10"
                  ></div>

                  <div className="flex justify-center gap-6 mt-12">
                    <button
                      type="button"
                      className="swiper-button-prev-custom bg-white shadow-xl hover:shadow-2xl w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border border-gray-200 z-10"
                    >
                      <svg
                        className="w-7 h-7 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="swiper-button-next-custom bg-white shadow-xl hover:shadow-2xl w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 border border-gray-200 z-10"
                    >
                      <svg
                        className="w-7 h-7 text-gray-700"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
      {/* For others users */}
      {role !== "Patient" && role !== null && (
        <>
          <ServicesPricingSection />
          <StatisticsSection />
          <PlatformFeaturesSection />

          {/* Frequently Ask Questions Section */}
          <div className="flex flex-col gap-8 justify-center items-center relative z-40 px-4">
            <HeaderSection
              leftText="Frequently Ask"
              gradientText="Questions"
              rightText=""
            />
            <FAQAccordion
              items={[
                {
                  question: "How do I set up my services and pricing?",
                  answer:
                    "Setting up your services is quick and easy. Navigate to your dashboard, click on 'Services & Pricing', and add your consultation fees, test prices, or scan rates. You can update them anytime to match your business needs.",
                },
                {
                  question: "How do I manage my appointment schedule?",
                  answer:
                    "Use our intuitive schedule management system to set your working hours, block unavailable times, and view all upcoming appointments. You can also set automatic reminders for both you and your patients.",
                },
                {
                  question: "How do I get paid for my services?",
                  answer:
                    "All payments are processed securely through our platform. Once a patient books and pays for your service, the amount is transferred directly to your account. You can track all transactions in your payment dashboard.",
                },
                {
                  question: "Can I answer patient questions on the platform?",
                  answer:
                    "Yes! You can browse and answer patient questions related to your specialty. This helps build your reputation and allows patients to learn more about your expertise before booking.",
                },
                {
                  question: "How do I improve my visibility to patients?",
                  answer:
                    "Complete your profile with detailed information, add your specialties, upload professional photos, and encourage satisfied patients to leave reviews. Higher ratings and complete profiles appear first in search results.",
                },
                {
                  question: "What support is available if I need help?",
                  answer:
                    "Our support team is available 24/7 to assist you with any questions or technical issues. You can reach us through the help center, email, or live chat. We're here to help you succeed on Dactra.",
                },
              ]}
            />
          </div>
        </>
      )}
    </div>
  );
}
