import { Formik, Form } from "formik";
import { useNavigate } from "react-router-dom";

//importing image
import mainImage from "../../assets/images/ForgotPasswordImage.png";

//importing icons
import { MdEmail } from "react-icons/md"; //email icon

//importing utils
import { forgetPasswordInitialValues } from "../../utils/formInitialValues";
import { forgetPasswordValidationSchema } from "../../utils/validationSchemas";

//importing components
import BrandLogo from "./../../Components/Common/BrandLogo";
import FormInputField from "../../Components/Auth/FormInputField";
import SubmitButton from "../../Components/Auth/SubmitButton";
import { motion, AnimatePresence } from "framer-motion";
import { useSendOTP } from "../../hooks/useSendOTP";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const sendOTPMutation = useSendOTP();

  //submiting function for the form
  const submiting = async (values, { setSubmitting }) => {
    //send data here
    try {
      const res = await sendOTPMutation.mutateAsync(values);
      if (res.status === 200) {
        navigate(`../OTPVerify`, {
          state: { email: values.email, flag: true },
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
    // navigate("../OTPverify");
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
            className="max-w-[90%] min-w-[250px] [--initial-var:] "
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
      </div>
      <div className="min-w-[280px] w-[95%] md:w-1/2 h-[90%] flex justify-center items-center">
        <div className="w-full pb-[20px]  md:my-[25px] lg:my-[40px] xl:my-[70px]  h-fit bg-[#FFFFFF] rounded-[25px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] flex flex-col pt-[20px] items-center gap-[20px]">
          <BrandLogo />
          <Formik
            initialValues={forgetPasswordInitialValues}
            validationSchema={forgetPasswordValidationSchema}
            onSubmit={submiting}
          >
            {({ isValid, dirty, isSubmitting }) => (
              <Form className="h-full w-[90%] md:w-2/3 flex flex-col gap-[20px] md:gap-[30px]">
                <p className="font-english text-[#003465] text-[15px]">
                  Please enter your email
                </p>
                <div className="flex flex-col gap-[10px]">
                  <FormInputField
                    name="email"
                    icon={MdEmail}
                    label="Email"
                    type="email"
                    placeholder="Enter your email..."
                  />
                </div>
                <div className="w-full flex flex-col gap-[5px] justify-center items-center h-[100px] md:h-[150px] lg:h-[100px] ">
                  <SubmitButton
                    text="Forget Password"
                    disabled={!isValid || !dirty}
                    isLoading={isSubmitting}
                    loadingText="Send data"
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
