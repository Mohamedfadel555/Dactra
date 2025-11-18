import { useState } from "react";
import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MdEmail } from "react-icons/md";
import { RiLock2Line, RiPhoneLine } from "react-icons/ri";

// Components
import BrandLogo from "../../Components/Common/BrandLogo";
import FormInputField from "../../Components/Auth/FormInputField";
import UserTypeSelector from "../../Components/Auth/UserTypeSelector";
import SubmitButton from "../../Components/Auth/SubmitButton";
import AuthLink from "../../Components/Auth/AuthLink";

// Constants & Utils
import {
  USER_TYPE_IMAGES,
  DEFAULT_USER_TYPE,
} from "../../constants/authConstants";
import { getSignupValidationSchema } from "../../utils/validationSchemas";
import { getSignupInitialValues } from "../../utils/formInitialValues";
import { useRegister } from "../../hooks/useRegister";
import { useSendOTP } from "../../hooks/useSendOTP";

export default function SignupPage() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState(DEFAULT_USER_TYPE);
  const registerMutation = useRegister();
  const sendOtpMutation = useSendOTP();
  const capitalizeFirstLetter = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const signupData = {
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        phoneNumber: values.phone,
        role: capitalizeFirstLetter(userType),
      };
      console.log("Signup data being sent:", signupData);
      
      try {
        await registerMutation.mutateAsync(signupData);
        // New account created successfully
        await sendOtpMutation.mutateAsync({ email: values.email });
        navigate("/auth/OTPVerify", {
          state: {
            email: values.email,
            userType,
          },
        });
      } catch (registerError) {
        // Check if email already exists (409 Conflict)
        if (registerError?.response?.status === 409) {
          // Email already exists - check if verified by trying to send OTP
          try {
            // Try to send OTP - if it succeeds, email exists but not verified
            await sendOtpMutation.mutateAsync({ email: values.email });
            // Email exists but not verified - go to OTP
            navigate("/auth/OTPVerify", {
              state: {
                email: values.email,
                userType,
              },
            });
          } catch (otpError) {
            // If sending OTP fails (e.g., email already verified), 
            // navigate directly to CompleteSignup
            console.log("Email appears to be verified, navigating to CompleteSignup");
            navigate("/auth/CompleteSignup", {
              state: {
                email: values.email,
                userType,
              },
            });
          }
        } else {
          // Other errors - rethrow to be handled by the outer catch
          throw registerError;
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      console.error("Server response:", error.response?.data);
      console.log("Role being sent:", userType);
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
                initialValues={getSignupInitialValues()}
                validationSchema={getSignupValidationSchema()}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, isValid, dirty }) => {
                  const isLoading =
                    isSubmitting ||
                    registerMutation.isPending ||
                    sendOtpMutation.isPending;
                  return (
                  <Form className="w-full flex flex-col gap-[20px] pb-[10px]">
                    <div className="flex flex-col gap-[10px]">
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
                        label="Phone Number"
                        type="tel"
                        placeholder="Enter Your Phone Number"
                        icon={RiPhoneLine}
                      />
                    </div>

                    {/* Submit Button & Auth Link */}
                    <div className="w-full flex flex-col gap-[10px] justify-center items-center pb-[10px]">
                      <SubmitButton
                        text="Sign Up"
                        loadingText="Signing up..."
                        isLoading={isLoading}
                        disabled={!isValid || !dirty}
                      />

                      <AuthLink
                        to="/auth/Login"
                        text="Do you have an account ?"
                        linkText="log in"
                      />
                    </div>
                    </Form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
