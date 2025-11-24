import PatientSignUpImage from "../assets/images/PatientSignUp.webp";
import DoctorSignUpImage from "../assets/images/DoctorSignUp.webp";
import ScanSignUpImage from "../assets/images/ScanSignUp.webp";
import LapSignUpImage from "../assets/images/LapSignUP.webp";

// User type images mapping
export const USER_TYPE_IMAGES = {
  patient: PatientSignUpImage,
  doctor: DoctorSignUpImage,
  scan: ScanSignUpImage,
  lap: LapSignUpImage,
};

// User types array
export const USER_TYPES = ["patient", "doctor", "scan", "lap"];

// Default user type
export const DEFAULT_USER_TYPE = "patient";
