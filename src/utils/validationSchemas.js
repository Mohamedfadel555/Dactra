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

const dateSchema = (label, userType = null) => {
  let schema = yup.date().required(`${label} is required`);

  // Add validation using .test() to check multiple conditions
  schema = schema.test("date-validation", function (value) {
    if (!value) return true; // Let required() handle empty values

    const selectedDate = new Date(value);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Reject today's date and future dates
    if (selectedDate >= today) {
      return this.createError({
        message: "You can't select today's date or a future date",
      });
    }

    // Check minimum age based on user type
    if (userType === "doctor") {
      const maxBirthDate = new Date();
      maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 25);
      maxBirthDate.setHours(0, 0, 0, 0);

      // Birth date must be before or equal to maxBirthDate (age >= 25)
      if (selectedDate > maxBirthDate) {
        return this.createError({
          message: "You must be at least 25 years old to register as a doctor",
        });
      }
    } else if (userType === "patient") {
      const maxBirthDate = new Date();
      maxBirthDate.setFullYear(maxBirthDate.getFullYear() - 12);
      maxBirthDate.setHours(0, 0, 0, 0);

      // Birth date must be before or equal to maxBirthDate (age >= 12)
      if (selectedDate > maxBirthDate) {
        return this.createError({
          message: "You must be at least 12 years old to register",
        });
      }
    }

    return true;
  });

  return schema;
};

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
      dateOfBirth: dateSchema("Date of birth", "patient"),
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
        .oneOf(["0", "1", "2"], "Select a valid smoking status")
        .required("Smoking status is required"),
      maritalStatus: yup
        .string()
        .oneOf(["0", "1", "2", "3"], "Select a valid marital status")
        .required("Marital status is required"),
      chronicDisease: yup
        .string()
        .min(2, "Chronic disease details must be at least 2 characters"),
      allergies: yup
        .string()
        .min(2, "Allergy details must be at least 2 characters"),
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
      dateOfBirth: dateSchema("Date of birth", "doctor"),
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

export const editPatientProfileValidationSchema = yup.object({
  firstName: nameSchema("First Name"),
  lastName: nameSchema("Last name"),
  phoneNamber: yup
    .string()
    .matches(/^[0-9]{10,15}$/, "Phone number must be 10-15 digits")
    .required("Phone number is required"),
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
  smokingStatus: yup
    .string()
    .oneOf(["0", "1", "2"], "Select a valid smoking status")
    .required("Smoking status is required"),
  maritalStatus: yup
    .string()
    .oneOf(["0", "1", "2", "3"], "Select a valid marital status")
    .required("Marital status is required"),
  bloodType: yup
    .string()
    .oneOf(
      ["0", "1", "2", "3", "4", "5", "6", "7"],
      "Select a valid blood type"
    )
    .required("Blood type is required"),
  addressId: yup
    .string()
    .oneOf(
      [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
        "20",
        "21",
        "22",
        "23",
        "24",
        "25",
        "26",
      ],
      "select a valid city"
    )
    .required("address is required"),
});

export const editDoctorProfileValidationSchema = yup.object({
  firstName: nameSchema("First Name"),
  lastName: nameSchema("Last name"),
  phoneNumber: yup
    .string()
    .matches(/^[0-9]{10,15}$/, "Phone number must be 10-15 digits")
    .required("Phone number is required"),
  address: yup
    .string()
    .min(4, "Too short")
    .max(150, "Too long")
    .required("required"),
  about: yup
    .string()
    .min(10, "Too short")
    .max(500, "Too long")
    .required("required"),
});

export const changePasswordValidationSchema = yup.object({
  oldPassword: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
  newPassword: yup
    .string()
    .required("Password is required")
    .notOneOf(
      [yup.ref("oldPassword")],
      "New password must be different from old password"
    )
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
      "Password must have upper, lower, number & symbol"
    ),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

export const qualificationsValidationSchema = yup.object({
  type: yup.string().required("required"),
  description: yup
    .string()
    .required("required")
    .min(20, "too short")
    .max(400, "too big"),
});
export const experienceValidationSchema = yup.object({
  content: yup
    .string()
    .required("required")
    .min(20, "too short")
    .max(400, "too big"),
});

export const deleteAccValidationSchema = yup.object({
  confirm: yup.string().oneOf(["Delete my account"]),
});
