import mainImage from "../../assets/images/ForgotPasswordImage.png";
import Icon from "../../assets/images/icons/dactraIcon.png";
import { MdEmail } from "react-icons/md"; //email icon
import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Navigate, useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  //initaial values for inputs
  const initialValues = {
    email: "",
  };

  //validation schema
  const validation = yup.object({
    email: yup.string().email("Invalid email").required("Email is required"),
  });

  //submiting function for the form
  const submiting = (values) => {
    //send data here
    console.log(values);
    navigate("../OTPverify");
  };

  return (
    <div className="w-full h-full flex-col  md:flex-row flex justify-center items-center gap-[30px] py-[10px] px-[40px] ">
      <div className=" flex justify-center items-center w-1/2 ">
        <img
          src={mainImage}
          alt="LoginImage"
          className="max-w-[90%] min-w-[250px]"
        />
      </div>
      <div className="min-w-[280px] w-[95%] md:w-1/2 h-[90%] flex justify-center items-center">
        <div className="w-full pb-[20px] md:pb-0 h-fit bg-[#FFFFFF] rounded-[25px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] flex flex-col pt-[20px] items-center gap-[20px]">
          <div className="flex justify-center items-center gap-[10px]">
            <img src={Icon} alt="dactra Icon" className="size-[50px]" />
            <p className="font-english font-[800] text-[30px] text-[#003465] ">
              Dactra
            </p>
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validation}
            onSubmit={submiting}
          >
            <Form className="h-full w-[90%] md:w-2/3 flex flex-col gap-[20px] md:gap-[30px]">
              <p className="font-english text-[#003465] text-[15px]">
                Please enter your email
              </p>
              <div className="flex flex-col gap-[10px]">
                <div className="flex flex-col gap-[5px]">
                  <label
                    htmlFor="email"
                    className="text-[#003465] font-[500] font-english "
                  >
                    Email
                  </label>
                  <div>
                    <div className="relative">
                      <MdEmail className="absolute left-2 top-1/2 -translate-y-1/2 text-[#BCBEC0]" />
                      <Field
                        type="email"
                        id="email"
                        name="email"
                        placeholder="Enter Your Email..."
                        className="w-full h-[32px] border placeholder:text-[#BCBEC0] placeholder:text-[15px] border-[#BCBEC0] rounded-[5px] pl-8 focus:outline-none
    focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:bg-blue-50 transition-all duration-300"
                      />
                    </div>
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-[12px]"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col gap-[5px] justify-center items-center h-[100px] md:h-[150px] lg:h-[100px] ">
                <button
                  type="submit"
                  className="text-[#FFFFFF] text-[18px] cursor-pointer  font-[600] font-english bg-[#3E69FE] w-full h-[40px] rounded-[5px] "
                >
                  Forget Password
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}
