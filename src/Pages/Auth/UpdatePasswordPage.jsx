import mainImage from "../../assets/images/UpdatePasswordImage.png";
import Icon from "../../assets/images/icons/dactraIcon.png";
import { MdEmail } from "react-icons/md";
import * as yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";

export default function UpdatePasswordPage() {
  const navigate = useNavigate();
  //initaial values for inputs
  const initialValues = {
    password: "",
    confirm_password: "",
  };

  //validation schema
  const validation = yup.object({
    password: yup
      .string()
      .min(8, "at least 8 chars")
      .required("password is required"),
    confirm_password: yup
      .string()
      .oneOf([yup.ref("password")], "passwords must match")
      .required("Confirm is required"),
  });

  //submiting function for the form
  const submiting = (values) => {
    //send data here
    console.log(values);
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
        <div className="w-full pb-[20px]  h-fit bg-[#FFFFFF] rounded-[25px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] flex flex-col pt-[20px] items-center gap-[15px]">
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
              <p className="font-english text-[#003465] text-[12px]">
                Create a new password, ensure it different form your ,previous
                ones for security.
              </p>
              <div className="flex flex-col gap-[10px]">
                <div className="flex flex-col gap-[5px]">
                  <label
                    htmlFor="Password"
                    className="text-[#003465] font-[500] font-english "
                  >
                    Password
                  </label>
                  <div>
                    <div className="relative">
                      <MdEmail className="absolute left-2 top-1/2 -translate-y-1/2 text-[#BCBEC0]" />
                      <Field
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Enter Your password..."
                        className="w-full h-[32px] border placeholder:text-[#BCBEC0] placeholder:text-[15px] border-[#BCBEC0] rounded-[5px] pl-8 focus:outline-none
    focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:bg-blue-50 transition-all duration-300"
                      />
                    </div>
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-[12px]"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-[5px]">
                  <label
                    htmlFor="Cpassword"
                    className="text-[#003465] font-[500] font-english "
                  >
                    Confirm password
                  </label>
                  <div>
                    <div className="relative">
                      <MdEmail className="absolute left-2 top-1/2 -translate-y-1/2 text-[#BCBEC0]" />
                      <Field
                        type="password"
                        id="Cpassword"
                        name="confirm_password"
                        placeholder="Enter Your Confirm..."
                        className="w-full h-[32px] border placeholder:text-[#BCBEC0] placeholder:text-[15px] border-[#BCBEC0] rounded-[5px] pl-8 focus:outline-none
    focus:border-blue-500 focus:ring-2 focus:ring-blue-400 focus:bg-blue-50 transition-all duration-300"
                      />
                    </div>
                    <ErrorMessage
                      name="confirm_password"
                      component="div"
                      className="text-red-500 text-[12px]"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col gap-[5px] justify-center items-center ">
                <button
                  type="submit"
                  className="text-[#FFFFFF] text-[18px] cursor-pointer  font-[600] font-english bg-[#3E69FE] w-full h-[40px] rounded-[5px] "
                >
                  Update Password
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}
