import { RiVidiconLine } from "react-icons/ri";
import { ImLab } from "react-icons/im";
import { GiRadioactive } from "react-icons/gi";
import { FaHandHoldingMedical } from "react-icons/fa";
import { motion } from "framer-motion";
import HeaderSection from "./../Components/Home/HeaderSection";
import HeroSection from "../Components/Home/HeroSection";
import ServiceCard from "../Components/Home/ServiceCard";
import { FaUserDoctor } from "react-icons/fa6";
import { GiLabCoat } from "react-icons/gi";
import { FaXRay } from "react-icons/fa";
import StepsSection from "../Components/Home/StepsSection";

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

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.55, ease: "easeOut" },
  },
};

const Role = "patien";

export default function HomePageForPatient() {
  return (
    <div className="w-full flex flex-col gap-[100px] lg:gap-[200px] pt-[100px] md:pt-[70px] font-english bg-[linear-gradient(145deg,#aec0ff_-28%,transparent_35%)]">
      {/* Section1 */}
      <HeroSection Role={Role} />
      {/* Section2 */}
      {Role === "patient" ? (
        <div className="flex flex-col gap-8 justify-center items-center relative z-40 px-4">
          <HeaderSection
            leftText="Top"
            gradientText="services"
            rightText="we offer"
            description="In today’s fast-paced world, your health deserves the utmost attention and convenience. That’s why Dactra offers a suite of integrated services designed to cater to your healthcare needs digitally:"
          />

          <div className="flex flex-col gap-6 w-full lg:w-[70%] flex-wrap mx-auto">
            {/* Row 1 */}
            <div className="w-full flex flex-col md:flex-row gap-6">
              {/* Doctor Consultations */}
              <ServiceCard
                icon={RiVidiconLine}
                header="Doctor Consultations"
                desc="Provide specialized medical consultations to patients through
                  video.
                  Manage your daily schedule with an easy, flexible
                  booking system designed to help you organize appointments and
                  enhance patient experience."
              />
              <ServiceCard
                Big={false}
                icon={ImLab}
                header={"Medical Scans"}
                desc={
                  "Find the nearest lab tests quickly and easily, check patient reviews, and book your tests with confidence"
                }
              />
            </div>

            {/* Row 2 */}
            <div className="w-full flex flex-col md:flex-row-reverse gap-6">
              {/* Prescription Finder */}
              <ServiceCard
                icon={FaHandHoldingMedical}
                header="Prescription Finder"
                desc="Find the Right Pharmacy Fast. <br /> Search for your
                  prescribed medicines and instantly see which nearby pharmacies
                  have them available, so you can get your medication without
                  delays."
              />
              {/* Radiology */}
              <ServiceCard
                Big={false}
                icon={GiRadioactive}
                header="Radiology"
                desc="Discover nearby radiology centers, see patient ratings, and
                  choose the best place for accurate and fast scans"
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
      <div className="flex flex-col gap-8 justify-center items-center px-0 md:px-4 ">
        <HeaderSection
          leftText="How"
          gradientText="our platform"
          rightText="works"
          description="Navigating your healthcare journey with Dactra is seamless. Just
          follow these steps mentioned below to proceed with your selected
          services. You can also see our FAQ section for more guidance:"
        />
        <StepsSection Role={Role} />
      </div>
    </div>
  );
}
