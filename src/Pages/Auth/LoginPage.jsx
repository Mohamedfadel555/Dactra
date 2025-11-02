import { Formik, Form } from "formik";

// importing imagesyy
import mainImage from "../../assets/images/AllLoginImage.png";
import GIcon from "../../assets/images/icons/googleIcon.png";

//importing icons
import { MdEmail } from "react-icons/md"; //email icon
import { RiLock2Line } from "react-icons/ri"; //password icon

//importing utils
import { loginInitialValues } from "../../utils/formInitialValues";
import { loginValidationSchema } from "../../utils/validationSchemas";

//importing Component
import BrandLogo from "../../Components/Common/BrandLogo";
import FormInputField from "./../../Components/Common/FormInputField";
import SubmitButton from "./../../Components/Common/SubmitButton";
import AuthLink from "./../../Components/Common/AuthLink";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  //submiting function for the form
  const submiting = (values) => {
    //send data here
    console.log(values);
  };

  return (
    <div className="w-full h-full flex-col  md:flex-row flex justify-center items-center gap-[30px] py-[10px] px-[40px] ">
      <div className=" flex justify-center items-center w-1/2 ">
        <AnimatePresence mode="wait">
          <motion.img
            key="login-image"
            src={mainImage}
            loading="eager"
            alt="LoginImage"
            className="max-w-[90%] min-w-[250px]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
      </div>
      <div className="min-w-[280px] w-[95%] md:w-1/2 h-[90%]  flex justify-center items-center">
        <div className="w-full pb-[20px]  md:my-[15px] lg:my-[30px] xl:my-[60px]  h-full bg-[#FFFFFF] rounded-[25px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] flex flex-col pt-[20px] items-center gap-[20px]">
          <BrandLogo />
          <Formik
            initialValues={loginInitialValues}
            validationSchema={loginValidationSchema}
            onSubmit={submiting}
          >
            {({ errors, touched }) => (
              <Form className="h-full w-[90%] md:w-2/3 flex flex-col gap-[20px] ">
                <div className="flex flex-col gap-[10px]">
                  <FormInputField
                    name="email"
                    icon={MdEmail}
                    label="Email"
                    type="email"
                    placeholder="Enter your email..."
                  />
                  <div className=" relative min-h-[84px]">
                    <FormInputField
                      name="password"
                      icon={RiLock2Line}
                      label="Password"
                      type="password"
                      placeholder="Enter your password..."
                    />
                    <Link
                      to="../ForgotPassword"
                      className="text-[12px] text-[#BCBEC0] self-end font-english absolute bottom-0 right-0 "
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-[5px] lg:gap-[10px] justify-center items-center">
                  <SubmitButton
                    text="Login"
                    disabled={
                      errors.email || errors.password
                        ? true
                        : !touched.email || !touched.password
                        ? true
                        : false
                    }
                  />
                  <p className="text-[#003465] text-[12px] font-[400]">
                    or continue with
                  </p>
                  <button
                    type="button"
                    className=" cursor-pointer w-full h-[40px] rounded-[5px] flex justify-center items-center border border-[#BCBEC0] "
                  >
                    <img
                      src={GIcon}
                      alt="Google Icon"
                      className="size-[30px]"
                    />
                  </button>
                  <AuthLink
                    to="../SignUp"
                    text="Don't have an account yet?"
                    linkText="Register"
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
