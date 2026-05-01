# NexusLMS • Premium E-Learning Platform 🎓

NexusLMS is a professional, production-ready Learning Management System (LMS) built with the **MERN stack**. It features a high-end SaaS aesthetic inspired by modern platforms like Stripe and Vercel, with a simplified "Hybrid" wording strategy tailored for students and beginners.

---

## 🚀 Live Demonstration
*(Insert your live URL here if deployed)*

---

## ✨ Key Features

### 🏛️ Admin Control Panel
- **System Overview**: Real-time analytics on platform growth (total users, courses, students).
- **User Management**: Professional registry to manage permissions and accounts.
- **System Security**: Role-Based Access Control (RBAC) to protect sensitive operations.

### 👨‍🏫 Instructor Workspace
- **Course Authoring**: Professional tools to create, edit, and draft courses.
- **Revenue Tracking**: Monitor student growth and projected earnings.
- **Media Management**: Integrated Cloudinary support for course thumbnails.

### 🎓 Student Experience
- **SaaS Discovery**: Modern course catalog with search and professional filtering.
- **Seamless Enrollment**: One-click enrollment system for quick skill acquisition.
- **Learning Dashboard**: Track progress and manage active courses in a clean workspace.

---

## 🛠️ Technology Stack

### Frontend (Modern SaaS UI)
- **React.js (Vite)**: Fast, modern development environment.
- **Framer Motion**: Smooth, premium micro-interactions and transitions.
- **Design System**: Custom CSS variables with Glassmorphism and dark theme.
- **React Bootstrap**: Responsive grid and layout components.

### Backend (Clean Architecture)
- **Node.js & Express**: High-performance RESTful API.
- **MongoDB & Mongoose**: Scalable NoSQL database with optimized indexing.
- **JWT Authentication**: Secure stateless session management.
- **Cloudinary**: Production-grade image hosting and management.

---

## 📁 Project Structure

```text
├── frontend/             # React application (Vite)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Main view components
│   │   ├── context/      # Auth & State management
│   │   └── services/     # API integration (Axios)
│
├── backend/              # Node.js Express server
│   ├── controllers/      # Business logic
│   ├── middleware/       # Async handlers & Error logic
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   └── utils/            # Helpers & Seeding logic
```

---

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd final-project
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
PORT=8080
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
FRONTEND_URL=https://lms-platform-jet.vercel.app
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=https://your-backend.up.railway.app
```

---

## 🚀 Starting the Application

### Launch Backend
```bash
cd backend
npm run dev
```

### Launch Frontend
```bash
cd frontend
npm run dev
```

---

## 🛣️ Core API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create a new student/instructor account |
| POST | `/api/auth/login` | Secure login and JWT generation |
| GET | `/api/courses` | Fetch all published courses |
| POST | `/api/enroll` | Enroll current student in a course |
| PUT | `/api/users/profile` | Update account settings & password |

---

## ✅ Deployment Checklist
- [x] Environment variables configured for production.
- [x] CORS allowed for production frontend domain.
- [x] Database indexes applied for query performance.
- [x] Cloudinary configured for image persistence.
- [x] Global error handling implemented for stability.

---
*Developed with ❤️ as a Final Year Project.*
