import * as yup from "yup";

// Base validation schema for signup
export const getSignupValidationSchema = () =>
  yup.object({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        "Password must have upper, lower, number & symbol"
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
    phone: yup
      .string()
      .matches(/^[0-9]{10,15}$/, "Phone number must be 10-15 digits")
      .required("Phone number is required"),
  });

const nameSchema = (label) =>
  yup
    .string()
    .matches(/^[A-Za-z\s]+$/, "Letters only are allowed")
    .min(2, `${label} must be at least 2 characters`)
    .required(`${label} is required`);

const dateSchema = (label) =>
  yup
    .date()
    .max(new Date(), "You can't select a future date")
    .required(`${label} is required`);

// Validation for the Complete Signup step (patient/doctor only)
export const getCompleteSignupValidationSchema = (userType) => {
  if (userType === "patient") {
    return yup.object({
      firstName: nameSchema("First name"),
      lastName: nameSchema("Last name"),
      gender: yup
        .string()
        .oneOf(["0", "1"], "Select a valid gender")
        .required("Gender is required"),
      dateOfBirth: dateSchema("Date of birth"),
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
          ["0", "1", "2", "3", "4", "5", "6", "7"],
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
        .oneOf(["0", "1", "2", "3"], "Select a valid marital status")
        .required("Marital status is required"),
      chronicDisease: yup
        .string()
        .min(2, "Chronic disease details must be at least 2 characters")
        .required("Chronic disease information is required"),
      allergies: yup
        .string()
        .min(2, "Allergy details must be at least 2 characters")
        .required("Allergy information is required"),
    });
  }

  if (userType === "doctor") {
    return yup.object({
      firstName: nameSchema("First name"),
      lastName: nameSchema("Last name"),
      gender: yup
        .string()
        .oneOf(["0", "1"], "Select a valid gender")
        .required("Gender is required"),
      dateOfBirth: dateSchema("Date of birth"),
      careerStartDate: dateSchema("Career start date"),
      clinicAddress: yup
        .string()
        .min(5, "Address must be at least 5 characters")
        .required("Clinic address is required"),
      licenseNumber: yup
        .string()
        .min(5, "License number must be at least 5 characters")
        .required("License number is required"),
      majorId: yup.string().required("Major is required"),
    });
  }

  // scan / lab
  return yup.object({
    displayName: yup
      .string()
      .matches(/^[A-Za-z0-9\s]+$/, "Only letters and numbers are allowed")
      .min(2, "Display name must be at least 2 characters")
      .required("Display name is required"),
    address: yup
      .string()
      .min(5, "Address must be at least 5 characters")
      .required("Address is required"),
    licenseNumber: yup
      .string()
      .min(5, "License number must be at least 5 characters")
      .required("License number is required"),
    about: yup
      .string()
      .min(10, "About section must be at least 10 characters")
      .required("About section is required"),
  });
};

// Login validation schema
export const loginValidationSchema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
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
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password must have upper, lower, number & symbol"
    ),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password")], "passwords must match")
    .required("Confirm is required"),
});
