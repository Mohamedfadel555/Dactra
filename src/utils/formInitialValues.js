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

