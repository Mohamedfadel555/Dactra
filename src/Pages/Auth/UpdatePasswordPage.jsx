import { Formik, Form } from "formik";

//importing image
import mainImage from "../../assets/images/UpdatePasswordImage.png";

//importing hooks
import { useNavigate } from "react-router-dom";

//importing utils
import { updatePasswordInitialValues } from "./../../utils/formInitialValues";
import { updatePasswordValidationSchema } from "./../../utils/validationSchemas";

//importing icons
import { RiLock2Line } from "react-icons/ri";

//importing components
import BrandLogo from "./../../Components/Common/BrandLogo";
import FormInputField from "./../../Components/Auth/FormInputField";
import SubmitButton from "../../Components/Auth/SubmitButton";
import { motion, AnimatePresence } from "framer-motion";
import { useResetPassword } from "../../hooks/useResetPassword";

export default function UpdatePasswordPage() {
  const navigate = useNavigate();

  const resetPasswordMutation = useResetPassword();

  //submiting function for the form
  const submiting = async (values, { setSubmitting }) => {
    //send data here
    const FormData = {
      refreshToken: localStorage.getItem("token"),
      newPassword: values.password,
      confirmPassword: values.confirm_password,
    };
    console.log(FormData);

    try {
      await resetPasswordMutation.mutateAsync(FormData);
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }

    console.log(values);
  };

  return (
    <div className="w-full h-full flex-col  md:flex-row flex justify-center items-center  py-[10px] px-[40px] ">
      <div className=" flex justify-center items-center w-1/2 ">
        <AnimatePresence mode="wait">
          <motion.img
            key="login-image"
            src={mainImage}
            alt="LoginImage"
            loading="eager"
            className="max-w-[90%] min-w-[250px]"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          />
        </AnimatePresence>
      </div>
      <div className="min-w-[280px] w-[95%] md:w-1/2 h-[90%] flex justify-center items-center">
        <div className="w-full pb-[20px]  md:my-[15px] lg:my-[30px] xl:my-[60px]  h-fit bg-[#FFFFFF] rounded-[25px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] flex flex-col pt-[20px] items-center gap-[15px]">
          <BrandLogo />
          <Formik
            initialValues={updatePasswordInitialValues}
            validationSchema={updatePasswordValidationSchema}
            onSubmit={submiting}
          >
            {({ isValid, dirty, isSubmitting }) => (
              <Form className="h-full w-[90%] md:w-2/3 flex flex-col gap-[20px] md:gap-[30px]">
                <p className="font-english text-[#003465] text-[12px]">
                  Create a new password, ensure it different form your ,previous
                  ones for security.
                </p>
                <div className="flex flex-col gap-[10px]">
                  <FormInputField
                    name="password"
                    icon={RiLock2Line}
                    label="Password"
                    type="password"
                    placeholder="Enter your password..."
                  />
                  <FormInputField
                    name="confirm_password"
                    icon={RiLock2Line}
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm your password..."
                  />
                </div>
                <div className="w-full flex flex-col gap-[5px] justify-center items-center ">
                  <SubmitButton
                    text="Update Password"
                    disabled={!isValid || !dirty}
                    isLoading={isSubmitting}
                    loadingText="Updating..."
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
