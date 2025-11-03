// Get initial values for signup form based on user type
export const getSignupInitialValues = (userType) => {
  const baseValues = {
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  };

  // doctor, scan, lap share licenseNumber
  if (userType !== "patient") {
    baseValues.licenseNumber = "";
  }

  // scan & lap have extra fields at initial signup
  if (userType === "scan" || userType === "lap") {
    baseValues.displayName = ""; // public name
    baseValues.address = "";
  }

  if (userType !== "scan" && userType !== "lab") {
    (baseValues.firstName = ""),
      (baseValues.lastName = ""),
      (baseValues.gender = "");
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
