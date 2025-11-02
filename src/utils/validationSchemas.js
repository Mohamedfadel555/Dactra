import * as yup from "yup";

// Base validation schema for signup
export const getSignupValidationSchema = (userType) => {
  const baseSchema = {
    fullName: yup
      .string()
      .min(3, "Full name must be at least 3 characters")
      .required("Full name is required"),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number"
      )
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
    phone: yup
      .string()
      .matches(/^[0-9]{10,15}$/, "Phone number must be 10-15 digits")
      .required("Phone number is required"),
  };

  if (userType !== "patient") {
    baseSchema.licenseNumber = yup
      .string()
      .min(5, "License number must be at least 5 characters")
      .required("License number is required");
  }

  return yup.object(baseSchema);
};

// Login validation schema
export const loginValidationSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "At least 8 chars")
    .required("Password is required"),
});

