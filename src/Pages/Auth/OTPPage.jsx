import mainImage from "../../assets/images/OTPImage.png";
import Icon from "../../assets/images/icons/dactraIcon.png";
import * as yup from "yup";
import { Formik, Form } from "formik";
import OTPInput from "react-otp-input";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function OTPPage() {
  const [time, setTime] = useState(60);
  const navigate = useNavigate();

  //resent timer
  useEffect(() => {
    if (time <= 0) return;
    const timer = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [time]);

  function handleResent() {
    setTime(60);
  }

  //initaial values for inputs
  const initialValues = {
    otp: "",
  };

  //validation schema
  const validation = yup.object({
    otp: yup.string().length(6, "OTP invalid").required("OTP invalild"),
  });

  //submiting function for the form
  const submiting = (values) => {
    //send data here
    console.log(values);
    navigate("../UpdatePassword");
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
        <div className="w-full pb-[20px]  h-fit bg-[#FFFFFF] rounded-[25px] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] flex flex-col pt-[20px] items-center gap-[20px]">
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
            {({ values, setFieldValue, errors, submitCount }) => (
              <Form className="h-full w-[90%] md:w-2/3 flex flex-col justify-evenly gap-[20px] md:gap-[30px]">
                <p className="font-english text-center text-[#003465] text-[14px]">
                  Code has been send to your email Check your Email
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
                  <button
                    type="submit"
                    className="text-[#FFFFFF] text-[18px] cursor-pointer  font-[600] font-english bg-[#3E69FE] w-full h-[40px] rounded-[5px] mb-[20px] "
                  >
                    Verify
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}
