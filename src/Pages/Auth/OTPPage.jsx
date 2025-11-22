import { Formik, Form } from "formik";

//importing image
import mainImage from "../../assets/images/OTPImage.png";

//importing hooks
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

//importing utils
import { OTPInitialValues } from "../../utils/formInitialValues";
import { OTPValidationDchema } from "../../utils/validationSchemas";

//importing components
import OTPInput from "react-otp-input";
import BrandLogo from "./../../Components/Common/BrandLogo";
import SubmitButton from "../../Components/Auth/SubmitButton";
import { motion, AnimatePresence } from "framer-motion";

//importing apis hooks
import { useVerifyOTP_ForgetPassword } from "../../hooks/useVerifyOTP_ForgetPassword";
import { useReSendOTP } from "../../hooks/useReSendOTP";
import { useVerifyOTP } from "../../hooks/useVerifyOTP";

export default function OTPPage() {
  const navigate = useNavigate();

  //state of timer
  const [time, setTime] = useState(60);

  const { state } = useLocation();
  const email = state?.email || "";
  const userType = state?.userType || "";
  const isPasswordFlow = !!state?.flag;

  useEffect(() => {
    if (!email) {
      navigate("/auth/Signup", { replace: true });
    }
  }, [email, navigate]);

  //hook of verify otp
  const verifyOTPMutation = useVerifyOTP();

  //hook of verify otp of forget password
  const verifyOTPForgetPasswordMutation = useVerifyOTP_ForgetPassword();

  //hook resend otp
  const reSendOTPMutation = useReSendOTP();

  //resent timer
  useEffect(() => {
    if (time <= 0) return;
    const timer = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [time]);

  //in this function handle resent api
  async function handleResent() {
    //the email that need to resend otp
    const data = {
      email,
    };

    try {
      await reSendOTPMutation.mutateAsync(data);
    } catch (err) {
      console.log(err);
    } finally {
      setTime(60);
    }
  }

  //submiting function for the form
  const submiting = async (values, { setSubmitting }) => {
    //object that will send to back
    const FormData = {
      email,
      otp: values.otp,
    };
    console.log(FormData);
    //handle otp cases
    //case one if the user is patient or doctor the the user need to complete his data so navigate to complete
    if (userType) {
      try {
        const res = await verifyOTPMutation.mutateAsync(FormData);
        if (res.status === 200) {
          navigate("/auth/CompleteSignup", {
            state: {
              email,
              userType,
            },
          });
        }
      } catch (err) {
        console.log(err);
      } finally {
        setSubmitting(false);
      }
      //this case of update password
    } else if (isPasswordFlow) {
      try {
        const res = await verifyOTPForgetPasswordMutation.mutateAsync(FormData);
      } catch (err) {
        console.log(err);
      } finally {
        setSubmitting(false);
      }
    } else {
      setSubmitting(false);
      navigate("/auth/Login");
    }
  };

  return (
    <div className="w-full h-full flex-col  md:flex-row flex justify-center items-center gap-[30px] py-[10px] px-[40px] ">
      <div className=" flex justify-center items-center w-1/2 ">
        <AnimatePresence mode="wait">
          <motion.img
            key="login-image"
            loading="eager"
            src={mainImage}
            alt="LoginImage"
            className="max-w-[90%] min-w-[250px]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
      </div>
      <div className="min-w-[280px] w-[95%] md:w-1/2 h-[90%] flex justify-center items-center">
        <div className="w-full pb-[20px] md:my-[45px] lg:my-[60px] xl:my-[90px] h-fit bg-[#FFFFFF] rounded-[25px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] flex flex-col pt-[20px] items-center gap-[20px]">
          <BrandLogo />
          <Formik
            initialValues={OTPInitialValues}
            validationSchema={OTPValidationDchema}
            onSubmit={submiting}
          >
            {({ values, setFieldValue, isSubmitting, submitCount, errors }) => (
              <Form className="h-full w-[90%] md:w-2/3 flex flex-col justify-evenly gap-[20px] md:gap-[30px]">
                <p className="font-english text-center text-[#003465] text-[14px]">
                  Code has been sent to your email. Check your email
                </p>
                <div className="flex flex-col gap-[10px] justify-center items-center">
                  <OTPInput
                    key={submitCount}
                    value={values.otp}
                    onChange={(value) => {
                      if (/^[0-9]*$/.test(value)) setFieldValue("otp", value);
                    }}
                    numInputs={6}
                    inputType="tel"
                    shouldAutoFocus
                    renderInput={(props) => (
                      <input
                        {...props}
                        className={` sm:!w-[40px] font-english !w-[32px] border-1 border-[#D9D9D9] sm:!h-[40px] !h-[32px] mx-1  focus:outline-0 text-xl bg-[#D9D9D9] focus:bg-white rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-300 transition-all ${
                          errors.otp && submitCount > 0
                            ? "border-red-500 animate-shake"
                            : ""
                        }`}
                      />
                    )}
                  />
                  {time <= 0 ? (
                    <p
                      onClick={handleResent}
                      className="font-english cursor-pointer font-[400] text-[14px]"
                    >
                      Resent Code <span className="text-[#145DB8]">Now!</span>
                    </p>
                  ) : (
                    <p className="font-english font-[400] text-[14px]">
                      Resent in <span className="text-[#145DB8]">{time}</span> s
                    </p>
                  )}
                </div>
                <div className="w-full flex flex-col gap-[5px] justify-center items-center">
                  <SubmitButton
                    text="Verify"
                    isLoading={isSubmitting}
                    loadingText="Verifiying"
                  />
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
