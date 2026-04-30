# Elevate LMS (Learning Management System) 🎓

A full-stack, production-ready Learning Management System built with the MERN stack (MongoDB, Express, React, Node.js). This platform provides a comprehensive e-learning experience with dedicated role-based portals for Students, Instructors, and Administrators.

## 🌟 Project Overview

Elevate LMS is designed to facilitate seamless online education. It allows instructors to create and publish courses with rich content, enables students to enroll and track their learning progress, and gives administrators complete oversight over user management. The project is fully functional, secure, and utilizes modern web development practices.

## ✨ Core Features

### 👤 Admin Features
- Secure Admin Dashboard with system-wide analytics.
- **User Management**: Full CRUD operations to create, update, delete, and view all users across the platform.
- Role-based access control enforcement.

### 👨‍🏫 Instructor Features
- Dedicated Instructor Dashboard to track active courses.
- **Course Creation Workflows**: Create rich courses with pricing, descriptions, and categories.
- **Media Uploads**: Integrated image uploads using `multer` for course thumbnails.
- **Publishing System**: Draft courses privately before publishing them live to the student catalog.

### 🎓 Student Features
- Comprehensive course catalog with search and filtering.
- **Course Enrollment**: Secure one-click enrollment system.
- Dedicated Student Dashboard (My Learning) to access enrolled courses.
- **Progress Tracking**: Real-time progress bars and "Mark Lesson Done" functionality that smoothly tracks completion percentages.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React.js (Vite)
- **Routing**: React Router DOM (v6)
- **Styling**: React Bootstrap (Bootstrap 5) & Vanilla CSS
- **HTTP Client**: Axios (with interceptors for JWT)
- **State Management**: React Context API

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) & Bcrypt.js
- **File Uploads**: Multer
- **Environment**: dotenv

---

## 🚀 Installation & Setup (Local Development)

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB Atlas account (or local MongoDB server)

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd final-project
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:5173
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

The application should now be running at `http://localhost:5173`!

---

## 🌐 Production Deployment Steps

### Backend Deployment (e.g., Render, Railway)
1. Push your code to GitHub.
2. Create a new Web Service on Render/Railway pointing to the `backend` folder.
3. Set the build command to `npm install` and the start command to `node server.js`.
4. Add all environment variables from your `.env` file to the deployment dashboard.
5. Once deployed, copy your live backend URL.

### Frontend Deployment (e.g., Vercel, Netlify)
1. Create a new project on Vercel/Netlify pointing to the `frontend` folder.
2. Set the framework preset to Vite.
3. Add the `VITE_API_URL` environment variable and set it to your LIVE backend URL (e.g., `https://your-api.onrender.com/api`).
4. Click Deploy!

*Note: Ensure your MongoDB Atlas cluster allows network access from anywhere (`0.0.0.0/0`) or your specific host provider's IP ranges.*

---

## 🛣️ API Endpoints Summary

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| **POST** | `/api/auth/register` | Register a new user | Public |
| **POST** | `/api/auth/login` | Authenticate user & get token | Public |
| **GET** | `/api/auth/me` | Get current logged-in user | Private |
| **GET** | `/api/users` | Get all users | Admin |
| **POST** | `/api/users` | Create a new user | Admin |
| **PUT** | `/api/users/:id` | Update a user | Admin |
| **DELETE** | `/api/users/:id` | Delete a user | Admin |
| **GET** | `/api/courses` | Get all published courses | Public |
| **GET** | `/api/courses/:id` | Get single course details | Public |
| **POST** | `/api/courses` | Create a new course | Instructor/Admin |
| **PUT** | `/api/courses/:id` | Update a course | Instructor/Admin |
| **PUT** | `/api/courses/:id/publish` | Publish/Unpublish a course | Instructor/Admin |
| **POST** | `/api/enroll` | Enroll in a course | Student |
| **GET** | `/api/my-courses` | Get enrolled courses | Student |
| **PUT** | `/api/progress/:courseId` | Update course progress | Student |

---

## 📸 Application Screenshots

*(Replace these placeholders with actual screenshots of your application before submission)*

1. **Homepage / Landing Page**: `[Screenshot Placeholder]`
2. **Student Dashboard (My Learning)**: `[Screenshot Placeholder]`
3. **Instructor Dashboard (Course Management)**: `[Screenshot Placeholder]`
4. **Admin Dashboard (User Management)**: `[Screenshot Placeholder]`

---

## 📝 Final Submission Checklist
- [x] Backend port dynamically assigned (`process.env.PORT || 5000`)
- [x] CORS properly configured for frontend domain
- [x] All hardcoded secrets removed and migrated to `.env`
- [x] `import.meta.env.VITE_API_URL` configured for frontend API calls
- [x] Database strictly restricted via JWT authentication
- [x] `.env.example` file provided for peer evaluation

---
*Developed with ❤️ as a Final Year Project.*
