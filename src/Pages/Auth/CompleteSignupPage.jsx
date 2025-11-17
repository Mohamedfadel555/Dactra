import React from "react";
import { Formik, Form } from "formik";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import BrandLogo from "../../Components/Common/BrandLogo";
import UserTypeSelector from "../../Components/Auth/UserTypeSelector";
import FormInputField from "../../Components/Auth/FormInputField";
import SubmitButton from "../../Components/Auth/SubmitButton";
import { USER_TYPE_IMAGES } from "../../constants/authConstants";
import { getCompleteSignupValidationSchema } from "../../utils/validationSchemas";

export default function CompleteSignupPage() {
  const [searchParams] = useSearchParams();
  const initialUserType = searchParams.get("userType") || "patient";
  const email = searchParams.get("email") || "";
  const navigate = useNavigate();
  const [userType, setUserType] = React.useState(initialUserType);

  const initialValues =
    userType === "patient"
      ? {
          dateOfBirth: "",
          height: "",
          weight: "",
          bloodType: "",
          smokingStatus: "",
          maritalStatus: "",
        }
      : {
          dateOfBirth: "",
          careerStartDate: "",
          clinicAddress: "",
        };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      console.log("Complete signup:", { userType, email, ...values });
      // TODO: send to backend, then navigate accordingly
      navigate("/auth/Login");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-[20px] py-[10px] px-[40px]">
      {/* User Type Selection - hide for patient/doctor */}
      {(userType === "scan" || userType === "lap") && (
        <div className="w-full max-w-[1000px] px-[20px]">
          <UserTypeSelector
            userType={userType}
            onUserTypeChange={setUserType}
          />
        </div>
      )}
      <div className="w-full flex-1 flex-col md:flex-row flex justify-center items-center gap-[30px]">
        {/* Left Section - Image (same style as Signup) */}
        <div className="flex justify-center items-center w-1/2">
          <AnimatePresence mode="wait">
            <motion.img
              key={userType}
              src={USER_TYPE_IMAGES[userType]}
              alt={`${userType} Complete SignUp Image`}
              className="max-w-[90%] min-w-[250px]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            />
          </AnimatePresence>
        </div>

        {/* Right Section - Form card (same style as Signup) */}
        <div className="min-w-[280px] w-[95%] md:w-1/2 flex justify-center items-center">
          <div className="w-full h-[500px] md:h-[550px] bg-[#FFFFFF] rounded-[25px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] flex flex-col pt-[20px] items-center gap-[20px] overflow-hidden">
            {/* Brand Logo */}
            <BrandLogo />

            {/* Scrollable Form Container */}
            <div className="flex-1 w-[90%] md:w-2/3 overflow-y-auto overflow-x-hidden pr-[5px] custom-scrollbar min-h-0 pb-[20px]">
              <Formik
                initialValues={initialValues}
                validationSchema={getCompleteSignupValidationSchema(userType)}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ isSubmitting, isValid, dirty }) => (
                  <Form className="w-full flex flex-col gap-[20px] pb-[10px]">
                    <div className="flex flex-col gap-[10px]">
                      {userType === "patient" ? (
                        <>
                          <FormInputField
                            name="dateOfBirth"
                            label="Date of Birth"
                            type="date"
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
                            <FormInputField
                              name="height"
                              label="Height (cm)"
                              type="number"
                              placeholder="Enter height"
                            />
                            <FormInputField
                              name="weight"
                              label="Weight (kg)"
                              type="number"
                              placeholder="Enter weight"
                            />
                          </div>
                          <FormInputField
                            name="bloodType"
                            label="Blood Type"
                            type="select"
                            placeholder="Select blood type"
                            options={[
                              { value: "A+", label: "A+" },
                              { value: "A-", label: "A-" },
                              { value: "B+", label: "B+" },
                              { value: "B-", label: "B-" },
                              { value: "AB+", label: "AB+" },
                              { value: "AB-", label: "AB-" },
                              { value: "O+", label: "O+" },
                              { value: "O-", label: "O-" },
                            ]}
                          />
                          <FormInputField
                            name="smokingStatus"
                            label="Smoking Status"
                            type="select"
                            placeholder="Select smoking status"
                            options={[
                              { value: "smoker", label: "Smoker" },
                              { value: "non-smoker", label: "Non-smoker" },
                              { value: "former", label: "Former" },
                            ]}
                          />
                          <FormInputField
                            name="maritalStatus"
                            label="Marital Status"
                            type="select"
                            placeholder="Select marital status"
                            options={[
                              { value: "single", label: "Single" },
                              { value: "married", label: "Married" },
                              { value: "divorced", label: "Divorced" },
                              { value: "widowed", label: "Widowed" },
                            ]}
                          />
                        </>
                      ) : (
                        <>
                          <FormInputField
                            name="dateOfBirth"
                            label="Date of Birth"
                            type="date"
                          />
                          <FormInputField
                            name="careerStartDate"
                            label="Career Start Date"
                            type="date"
                          />
                          <FormInputField
                            name="clinicAddress"
                            label="Clinic Address"
                            type="text"
                            placeholder="Enter clinic address"
                          />
                        </>
                      )}
                    </div>

                    {/* Submit */}
                    <div className="w-full flex flex-col gap-[10px] justify-center items-center pb-[10px]">
                      <SubmitButton
                        text="Sign Up"
                        loadingText="Saving..."
                        isLoading={isSubmitting}
                        disabled={!isValid || !dirty}
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
