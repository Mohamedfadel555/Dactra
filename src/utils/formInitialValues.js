// Get initial values for signup form based on user type
export const getSignupInitialValues = (userType) => {
  const baseValues = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  };

  if (userType !== "patient") {
    return {
      ...baseValues,
      licenseNumber: "",
    };
  }

  return baseValues;
};

// Initial values for login form
export const loginInitialValues = {
  email: "",
  password: "",
};

//Initial values for Forget Password Form
export const forgetPasswordInitialValues = {
  email: "",
};

//Initial values for OTP
export const OTPInitialValues = {
  otp: "",
};

//Initial values for Update Password Form
export const updatePasswordInitialValues = {
  password: "",
  confirm_password: "",
};
