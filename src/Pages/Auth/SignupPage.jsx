import { useState } from "react";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { MdEmail, MdPerson } from "react-icons/md";
import { RiLock2Line, RiPhoneLine } from "react-icons/ri";
import { FaIdCard } from "react-icons/fa";

// Components
import BrandLogo from "../../Components/Common/BrandLogo";
import FormInputField from "../../Components/Common/FormInputField";
import UserTypeSelector from "../../Components/Common/UserTypeSelector";
import SubmitButton from "../../Components/Common/SubmitButton";
import AuthLink from "../../Components/Common/AuthLink";

// Constants & Utils
import {
  USER_TYPE_IMAGES,
  DEFAULT_USER_TYPE,
} from "../../constants/authConstants";
import { getSignupValidationSchema } from "../../utils/validationSchemas";
import { getSignupInitialValues } from "../../utils/formInitialValues";

export default function SignupPage() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(DEFAULT_USER_TYPE);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Prepare data for backend
      const signupData = {
        userType,
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        phone: values.phone,
      };

      // Add license number if not patient
      if (userType !== "patient") {
        signupData.licenseNumber = values.licenseNumber;
      }

      // TODO: Replace with actual backend endpoint when server is ready
      // Example: const response = await axios.post('https://api.example.com/auth/signup', signupData);
      // For now, just simulate API call
      console.log("Signup data:", signupData);

      // Save to localStorage
      const existingData = JSON.parse(
        localStorage.getItem("signupData") || "[]"
      );
      existingData.push({
        ...signupData,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("signupData", JSON.stringify(existingData));

      // Show success message
      toast.success(
        "Signup successful! Please check your email for verification."
      );

      // TODO: After backend is connected and verification endpoint is ready:
      // 1. Navigate to verification page: navigate(`/auth/verify?email=${values.email}&userType=${userType}`);
      // 2. Remove localStorage saving (data will be handled by backend)
      // 3. Handle verification code sending from backend
    } catch (error) {
      console.error("Signup error:", error);
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-[20px] py-[10px] px-[40px]">
      {/* User Type Selection - Above image and form */}
      <div className="w-full max-w-[1000px] px-[20px]">
        <UserTypeSelector userType={userType} onUserTypeChange={setUserType} />
      </div>

      {/* Content Section - Image and Form */}
      <div className="w-full flex-1 flex-col md:flex-row flex justify-center items-center gap-[30px]">
        {/* Left Section - Image */}
        <div className="flex justify-center items-center w-1/2">
          <AnimatePresence mode="wait">
            <motion.img
              key={userType}
              src={USER_TYPE_IMAGES[userType]}
              alt={`${userType} SignUp Image`}
              className="max-w-[90%] min-w-[250px]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
        </div>

        {/* Right Section - Form */}
        <div className="min-w-[280px] w-[95%] md:w-1/2 flex justify-center items-center">
          <div className="w-full h-fit md:h-[400px] lg:h-[450px] xl:h-[500px] bg-[#FFFFFF] rounded-[25px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] flex flex-col pt-[20px] items-center gap-[20px] overflow-hidden">
            {/* Brand Logo */}
            <BrandLogo />

            {/* Scrollable Form Container */}
            <div className="flex-1 w-[90%] md:w-2/3 overflow-y-auto overflow-x-hidden pr-[5px] custom-scrollbar min-h-0 pb-[20px]">
              <Formik
                key={userType} // Reset form when user type changes
                initialValues={getSignupInitialValues(userType)}
                validationSchema={getSignupValidationSchema(userType)}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting }) => (
                  <Form className="w-full flex flex-col gap-[20px] pb-[10px]">
                    <div className="flex flex-col gap-[10px]">
                      {/* Full Name */}
                      <FormInputField
                        name="fullName"
                        label="Full Name"
                        type="text"
                        placeholder="Enter Your Full Name"
                        icon={MdPerson}
                      />

                      {/* Email */}
                      <FormInputField
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="username@gmail.com"
                        icon={MdEmail}
                      />

                      {/* Password */}
                      <FormInputField
                        name="password"
                        label="password"
                        type="password"
                        placeholder="Enter Your Password"
                        icon={RiLock2Line}
                      />

                      {/* Confirm Password */}
                      <FormInputField
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm Your Password"
                        icon={RiLock2Line}
                      />

                      {/* Phone */}
                      <FormInputField
                        name="phone"
                        label="Phone"
                        type="tel"
                        placeholder="Enter Your Phone Number"
                        icon={RiPhoneLine}
                      />

                      {/* License Number - Only for non-patient users */}
                      {userType !== "patient" && (
                        <FormInputField
                          name="licenseNumber"
                          label="License Number"
                          type="text"
                          placeholder="Enter Your License Number"
                          icon={FaIdCard}
                        />
                      )}
                    </div>

                    {/* Submit Button & Auth Link */}
                    <div className="w-full flex flex-col gap-[10px] justify-center items-center pb-[10px]">
                      <SubmitButton
                        text="Complete Sign Up"
                        loadingText="Signing up..."
                        isLoading={isSubmitting}
                      />

                      <AuthLink
                        to="/auth/Login"
                        text="Do you have an account ?"
                        linkText="log in"
                      />
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
