# LabCare – Medical Laboratory Management System

LabCare is a full-stack medical laboratory management and reporting system designed to streamline laboratory operations, patient management, test bookings, payments, and diagnostic report management.

## Features

- **Dashboard:** Overview of laboratory operations and recent bookings.
- **Patient Management:** Add, update, search, and manage patient records.
- **Doctor Management:** Maintain doctor information.
- **Test Management:** Manage laboratory tests and test details.
- **Category Management:** Organize laboratory tests by categories.
- **Price Management:** Manage test pricing.
- **Booking Management:** Create bookings and track their workflow.
- **Payment Management:** Track pending, partial, and paid payments.
- **Report Management:** Create reports, enter test results, and verify reports.
- **Role-Based Access:** Separate Admin and Staff permissions.
- **Print & PDF:** Print verified diagnostic reports.

## Technology Stack

### Frontend
- React
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

## Project Structure

```text
LabCare/
├── backend/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── app.js
│       └── server.js
│
├── frontend/
│   └── src/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       ├── services/
│       └── store/
│
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/satpal055/labcare.git
cd labcare
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local frontend URL provided by Vite, usually:

```text
http://localhost:5173
```

## User Roles

### Admin
- Manage laboratory operations.
- Manage payment status.
- Verify diagnostic reports.
- Manage users and records.

### Staff
- Manage patients and bookings.
- Collect samples and update booking workflow.
- Create reports and enter test results.

## Booking and Report Workflow

Patient Registration → Test Booking → Payment → Sample Collection → Processing → Booking Completion → Report Creation → Result Entry → Admin Verification → Report Printing.

## Environment Variables

Never commit `.env` files or expose database credentials, JWT secrets, or other sensitive information.

## Developer

**Developed by Satpal Singh**

GitHub: https://github.com/satpal055

---

*LabCare is a portfolio and software development project. It requires further security, privacy, regulatory, and operational validation before being used with real patient data in a clinical laboratory.*
