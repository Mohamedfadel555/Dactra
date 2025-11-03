import * as yup from "yup";

// Base validation schema for signup
export const getSignupValidationSchema = (userType) => {
  const baseSchema = {
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

  if (userType === "scan" || userType === "lap") {
    baseSchema.displayName = yup
      .string()
      .matches(/^[A-Za-z]+$/, "Letters only are allowed")
      .min(2, "Display name must be at least 2 characters")
      .required("Display name is required");
    baseSchema.address = yup
      .string()
      .min(5, "Address must be at least 5 characters")
      .required("Address is required");
  }

  if (userType === "patient" || userType === "doctor") {
    (baseSchema.firstName = yup
      .string()
      .matches(/^[A-Za-z]+$/, "Letters only are allowed")
      .min(2, "First name must be at least 2 characters")
      .required("First name is required")),
      (baseSchema.lastName = yup
        .string()
        .matches(/^[A-Za-z]+$/, "Letters only are allowed")
        .min(2, "First name must be at least 2 characters")
        .required("First name is required")),
      (baseSchema.gender = yup
        .string()
        .oneOf(["male", "female"], "Select a valid gender")
        .required("Gender is required"));
  }

  return yup.object(baseSchema);
};

// Validation for the Complete Signup step (patient/doctor only)
export const getCompleteSignupValidationSchema = (userType) => {
  if (userType === "patient") {
    return yup.object({
      dateOfBirth: yup
        .date()
        .max(new Date(), "You can't select a future date")
        .required("Date of birth is required"),
      height: yup
        .number()
        .typeError("Height must be a number")
        .min(30, "Height too small")
        .max(300, "Height too large")
        .required("Height is required"),
      weight: yup
        .number()
        .typeError("Weight must be a number")
        .min(2, "Weight too small")
        .max(500, "Weight too large")
        .required("Weight is required"),
      bloodType: yup
        .string()
        .oneOf(
          ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
          "Select a valid blood type"
        )
        .required("Blood type is required"),
      smokingStatus: yup
        .string()
        .oneOf(
          ["smoker", "non-smoker", "former"],
          "Select a valid smoking status"
        )
        .required("Smoking status is required"),
      maritalStatus: yup
        .string()
        .oneOf(
          ["single", "married", "divorced", "widowed"],
          "Select a valid marital status"
        )
        .required("Marital status is required"),
    });
  }

  // doctor
  return yup.object({
    dateOfBirth: yup
      .date()
      .max(new Date(), "You can't select a future date")
      .required("Date of birth is required"),
    careerStartDate: yup
      .date()
      .max(new Date(), "You can't select a future date")
      .required("Date of birth is required"),
    clinicAddress: yup
      .string()
      .min(5, "Address must be at least 5 characters")
      .required("Clinic address is required"),
  });
};

// Login validation schema
export const loginValidationSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "At least 8 chars")
    .required("Password is required"),
});

//Forget Password validation schema
export const forgetPasswordValidationSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
});

//OTP validation schema
export const OTPValidationDchema = yup.object({
  otp: yup.string().length(6, "OTP invalid").required("OTP invalild"),
});

//Update Password Validation schema
export const updatePasswordValidationSchema = yup.object({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    )
    .required("Password is required"),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "passwords must match")
    .required("Confirm is required"),
});
