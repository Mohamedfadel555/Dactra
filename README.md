<div align="center">

<img src="https://img.shields.io/badge/Dactra-دكترة-4F46E5?style=for-the-badge&logo=react&logoColor=white" alt="Dactra"/>

# 🏥 Dactra — دكترة

### An integrated medical platform connecting patients with doctors and labs in one place

[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=flat&logo=react-query&logoColor=white)](https://tanstack.com/query)
[![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Live_Demo-000000?style=flat&logo=vercel&logoColor=white)](https://dactrav1.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**🔗 [dactrav1.vercel.app](https://dactrav1.vercel.app/)**

</div>

---

## 📖 About the Project

**Dactra (دكترة)** is a comprehensive medical platform that simplifies the patient's entire journey — from booking appointments to AI-powered radiology analysis. The platform connects patients, doctors, labs, and radiology centers all under one roof.

> This is a graduation project built with React.js, featuring a complete role-based system: Patient — Doctor — Service Provider (Lab/Radiology Center) — Admin.

---

## ✨ Key Features

### 👤 Patient

- **Appointment Booking** — Online and offline with any doctor
- **Video Consultation** — Remote checkups via video call
- **Medical Profile** — Includes vital signs (blood pressure, blood sugar, heart rate...), allergies, and chronic conditions
- **Medical Archive** — Store and access lab results and radiology reports
- **Exclusive Discounts** — On lab tests when booked through a sponsoring doctor

### 🩺 Doctor

- **Professional Profile** — Includes qualifications, experience, specializations, and ratings
- **Dashboard** — Manage patients, appointments, and offers
- **Sponsorship System** — Doctors sponsor labs and grant their patients discounts
- **Referral Management** — Refer patients to labs with case tracking

### 🏨 Service Provider (Lab / Radiology Center)

- **Provider Profile** — Lists services, pricing, and offers
- **Deals System** — Negotiate sponsorship terms with doctors
- **Referred Patient Management** — Track patients referred through doctors

### 🤖 AI Features (Chatbot)

- **Medical Chatbot** — Answers general medical questions
- **Radiology Analysis** — Reads X-ray and CT scan images
- **Lab Result Interpretation** — Analyzes blood tests and lab results
- **Skin Disease Detection** — Diagnoses skin conditions from photos
- **Injury Analysis** — Assists in injury assessment

### 💬 Medical Community

- **Medical Articles** — Published by doctors and specialists
- **Q&A Forum** — A space for medical cases and inquiries
- **Tags** — Filter content by specialty

### 🔔 Notification System

- Instant notifications via **Firebase Cloud Messaging**
- Real-time notifications via **SignalR**

---

## 🛠️ Tech Stack

| Technology                       | Usage                           |
| -------------------------------- | ------------------------------- |
| **React.js 18**                  | Frontend UI                     |
| **JavaScript (ES6+)**            | Core programming language       |
| **React Router v6**              | Page navigation (Lazy Loading)  |
| **TanStack Query (React Query)** | Server state & cache management |
| **Axios**                        | API communication               |
| **Tailwind CSS**                 | Styling & design                |
| **Framer Motion**                | Animations & transitions        |
| **Firebase (FCM)**               | Push notifications              |
| **SignalR**                      | Real-time communication         |
| **Swiper.js**                    | Sliders & carousels             |
| **React Icons**                  | Icons                           |
| **React Toastify**               | UI toast notifications          |
| **Formik / Yup**                 | Form management & validation    |

---

## 🗂️ Project Structure

```
src/
├── api/                        # All API requests
│   ├── authAPI.jsx
│   ├── appointmentAPI.jsx
│   ├── CommunityAPI.jsx
│   ├── sponsorshipAPI.jsx
│   └── ...
├── Components/
│   ├── Admin/                  # Admin panel components
│   ├── Auth/                   # Authentication components
│   ├── ChatBot/                # Chatbot components
│   ├── Common/                 # Shared components (Navbar, Footer...)
│   ├── Community/              # Community components
│   ├── Home/                   # Homepage components
│   ├── Profile/                # Profile components
│   └── Provider/               # Service provider components
├── Context/
│   └── AuthContext.jsx         # Global authentication state
├── firebase/                   # Firebase configuration
├── hooks/                      # Custom Hooks (50+ hooks)
├── Layout/                     # Page layouts
│   ├── Layout.jsx
│   ├── AuthLayout.jsx
│   ├── AdminLayout.jsx
│   ├── DoctorDashboardLayout.jsx
│   └── ProviderLayout.jsx
├── Pages/
│   ├── Admin/                  # Admin pages
│   ├── Auth/                   # Authentication pages
│   ├── Appointment/            # Appointment pages
│   ├── Community/              # Community pages
│   ├── DoctorDashboard/        # Doctor dashboard
│   ├── Profile/                # Profile pages
│   └── Provider/               # Provider pages
├── services/
│   └── signalR.jsx             # SignalR service
├── utils/                      # Helper utilities
├── Routes.jsx                  # All route definitions
└── App.jsx                     # Main entry point
```

---

## 👥 User Roles

| Role                         | Permissions                                        |
| ---------------------------- | -------------------------------------------------- |
| **Patient**                  | Booking, medical profile, chatbot, community       |
| **Doctor**                   | Dashboard, patients, lab sponsorship, appointments |
| **Provider** (Lab/Radiology) | Deals, referred patients, services                 |
| **Admin**                    | Full platform management                           |

---

## 🚀 Running Locally

### Requirements

- [Node.js](https://nodejs.org/) v18 or newer
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/Mohamedfadel555/dactra.git

# 2. Navigate to the project folder
cd dactra

# 3. Install dependencies
npm install

# 4. Create the environment file
cp .env.example .env
# Edit .env with the required values

# 5. Start the development server
npm run dev
```

The project will run at `http://localhost:5173`

### Production Build

```bash
npm run build
```

### Required Environment Variables (.env)

```env
VITE_API_BASE_URL=your_api_url
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🌐 Live Demo

**🔗 [https://dactrav1.vercel.app/](https://dactrav1.vercel.app/)**

---

## 🤝 Contributing

```bash
# 1. Fork the repository
# 2. Create a new branch
git checkout -b feature/feature-name

# 3. Commit your changes
git commit -m "feat: describe your change"

# 4. Push the branch
git push origin feature/feature-name

# 5. Open a Pull Request
```

---
