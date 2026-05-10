<div align="center">

<img src="https://img.shields.io/badge/Dactra-Medical%20Platform-3E69FE?style=for-the-badge&logo=heart&logoColor=white" alt="Dactra" />

# 🏥 Dactra

### A Comprehensive Digital Healthcare Platform

_Connecting Patients, Doctors & Medical Providers — All in One Place_

<br/>

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)

<br/>

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [User Roles](#-user-roles)
- [Screenshots](#-screenshots)
- [Team](#-team)

---

## 🌟 About

**Dactra** is a full-featured medical web platform designed to bridge the gap between patients, doctors, and medical providers. It enables seamless healthcare management — from booking appointments and tracking health metrics, to AI-powered medical report analysis and doctor–lab partnership deals.

> Built as a graduation project with a focus on real-world healthcare needs.

---

## ✨ Features

### 🧑‍⚕️ For Patients

| Feature                  | Description                                                        |
| ------------------------ | ------------------------------------------------------------------ |
| 📊 **Health Dashboard**  | Visual charts for blood pressure, blood sugar & heart rate         |
| 📁 **Medical Reports**   | Upload and view PDFs/images of lab results & scans                 |
| 🤖 **AI Chatbot**        | Ask medical questions and get AI-powered analysis of your reports  |
| 🔍 **Find Doctors**      | Search by specialty, view credentials, ratings & reviews           |
| 🏥 **Find Providers**    | Discover labs & scan centers with services, prices & availability  |
| 📅 **My Appointments**   | Track upcoming, completed, unpaid, cancelled & failed appointments |
| 💬 **Community**         | Browse articles, ask questions, and get answers from real doctors  |
| 🔔 **Notifications**     | Firebase push notifications for appointments & doctor replies      |
| ⭐ **Favourites**        | Save preferred doctors and providers for quick access              |
| 🚩 **Reports & Ratings** | Rate providers and report policy violations                        |

### 👨‍⚕️ For Doctors

| Feature                       | Description                                                         |
| ----------------------------- | ------------------------------------------------------------------- |
| 📝 **Community Publishing**   | Write medical articles and answer patient questions                 |
| 👥 **Patients Under Care**    | View and manage profiles of patients who booked with you            |
| 🤝 **Deals Dashboard**        | Accept, reject, or counter partnership deals from medical providers |
| 🔬 **Lab Referrals**          | Send patient data to labs for discounted testing                    |
| 📅 **Appointment Management** | View upcoming, completed & cancelled appointments                   |

### 🏥 For Medical Providers (Labs & Scan Centers)

| Feature                   | Description                                                      |
| ------------------------- | ---------------------------------------------------------------- |
| 🛠️ **Service Management** | List services with prices, descriptions & estimated duration     |
| 🤝 **Deals System**       | Send, negotiate, accept or reject partnership deals with doctors |
| 🕐 **Working Hours**      | Set and update availability schedule                             |
| 🧪 **Patient Data**       | Receive referred patients from sponsored doctors with discounts  |

### 🔐 For Admins

| Feature                       | Description                                           |
| ----------------------------- | ----------------------------------------------------- |
| ✅ **User Approvals**         | Approve doctors & providers before they go live       |
| 🚫 **User Blocking**          | Block policy-violating users                          |
| 🗂️ **Static Data Management** | Manage specialties, allergies & chronic disease lists |
| 📢 **Complaints Handling**    | Review and act on user complaints & suggestions       |

---

## 🛠 Tech Stack

```
Frontend       →   React.js + Vite + Tailwind CSS
Authentication →   JWT (JSON Web Tokens)
Notifications  →   Firebase Cloud Messaging (FCM)
AI Chatbot     →   AI-powered medical assistant
File Uploads   →   PDF & Image support for medical reports
Routing        →   React Router v6
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>= 18.x`
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/dactra.git

# 2. Navigate to the project directory
cd dactra

# 3. Install dependencies
npm install

# 4. Create your environment variables file
cp .env.example .env
# Fill in your API base URL, Firebase config, etc.

# 5. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

---

## 📁 Project Structure

```
dactra/
├── public/                  # Static public assets
├── src/
│   ├── assets/              # Images, icons, fonts
│   ├── components/          # Reusable UI components
│   │   ├── Auth/            # Login, register, AuthLayout
│   │   ├── Common/          # Buttons, cards, modals, loaders
│   │   └── Charts/          # Health metric charts
│   ├── pages/               # Route-level page components
│   │   ├── Patient/         # Profile, Appointments, Community, Chatbot
│   │   ├── Doctor/          # Dashboard, Deals, Patients Under Care
│   │   ├── Provider/        # Services, Deals, Patient Data
│   │   └── Admin/           # User management, static data, complaints
│   ├── context/             # Auth context & role management
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API call wrappers
│   └── routes/              # Protected & role-based routes
├── .env.example             # Environment variable template
├── vite.config.js           # Vite configuration
└── README.md
```

---

## 👤 User Roles

Dactra supports **4 roles**, each with a completely different experience:

```
┌─────────────────────────────────────────────────────────────┐
│                        DACTRA ROLES                         │
├──────────────┬──────────────┬───────────────┬───────────────┤
│   PATIENT    │    DOCTOR    │   PROVIDER    │    ADMIN      │
│              │              │  (Lab/Scan)   │               │
├──────────────┼──────────────┼───────────────┼───────────────┤
│ Health track │ Publish posts│ Manage deals  │ Approve users │
│ Book appts   │ Manage appts │ List services │ Block users   │
│ AI chatbot   │ Deals panel  │ Working hours │ Manage data   │
│ Community    │ Patient care │ Patient data  │ Handle reports│
└──────────────┴──────────────┴───────────────┴───────────────┘
```

The **home page and navigation dynamically adapt** based on the logged-in user's role.

---

## 🔄 Key Flows

<details>
<summary><strong>🔐 Authentication Flow</strong></summary>

1. User selects role on signup (Patient / Doctor / Lab / Scan Center)
2. Fills out role-specific registration form
3. Backend issues a **JWT token**
4. Role in token controls accessible pages and features

</details>

<details>
<summary><strong>📅 Booking Flow</strong></summary>

1. Patient searches for a doctor or provider
2. Views profile, ratings, and available slots
3. Confirms booking (paid or unpaid)
4. Firebase sends confirmation notification
5. Booking appears in both patient's and doctor's "My Appointments"

</details>

<details>
<summary><strong>🤖 AI Chatbot Flow</strong></summary>

1. Patient opens chatbot and asks a question or uploads a file
2. AI processes the lab result or scan and generates a plain-language summary
3. Chatbot asks: _"Would you like to save this to your profile?"_
4. If confirmed, summary is stored and accessible from the patient's profile

</details>

<details>
<summary><strong>🤝 Deals Flow</strong></summary>

1. Medical Provider sends a deal proposal to a Doctor
2. Doctor reviews the proposal in their Deals Dashboard
3. Doctor can Accept, Reject, or Counter the offer
4. Accepted deals activate sponsorship and enable patient referral discounts

</details>

<details>
<summary><strong>💬 Community Flow</strong></summary>

1. Doctor publishes an article or patient posts a question
2. Content appears in the community feed
3. Users can like, save, or mark interest
4. When a doctor replies, the patient receives a **Firebase push notification**

</details>

</div>
