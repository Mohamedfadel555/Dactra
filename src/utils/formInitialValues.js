// Get initial values for signup form (shared across user types)
export const getSignupInitialValues = () => ({
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
});

// Complete signup step initial values per user type
export const getCompleteSignupInitialValues = (userType = "patient") => {
  if (userType === "patient") {
    return {
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: "",
      height: "",
      weight: "",
      bloodType: "",
      smokingStatus: "",
      maritalStatus: "",
      chronicDisease: "",
      allergies: "",
    };
  }

  if (userType === "doctor") {
    return {
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: "",
      careerStartDate: "",
      clinicAddress: "",
      licenseNumber: "",
      majorId: "",
    };
  }

  return {
    displayName: "",
    address: "",
    licenseNumber: "",
    about: "",
  };
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
