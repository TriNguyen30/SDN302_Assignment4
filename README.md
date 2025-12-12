📚 Quiz Bank – MERN Stack Application

Quiz Bank là một ứng dụng xây dựng bằng MERN Stack (MongoDB, Express, React, NodeJS) cho phép người dùng xem danh sách quiz, làm bài quiz, xem kết quả và quản lý dữ liệu (tùy yêu cầu).

🚀 Tech Stack
Frontend

React + TypeScript

Vite

React Router

Axios

Vercel (Deploy)

Backend

NodeJS

Express

Mongoose

JSON Web Token (JWT)

Render (Deploy)

Database

MongoDB Atlas

MongoDB Compass (Quản lý dữ liệu)

🌟 Features

🔐 Authentication (Login / Register)

📚 Danh sách các quiz

🧠 Làm bài quiz theo từng câu hỏi

📊 Tính điểm tự động

📝 CRUD quiz (nếu bạn dùng tính năng admin)

🌐 Triển khai online với Vercel + Render

🛡 CORS bảo mật

📦 API RESTful

📦 Project Structure
QuizBank/
│
├── backend/
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── server.js
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   ├── components/
    │   ├── hooks/
    │   ├── App.tsx
    ├── vite.config.ts
    ├── vercel.json
    └── .env

🔧 Environment Variables
Backend (.env)
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
PORT=3000   # optional khi deploy

Frontend (.env)
VITE_ENV=production
VITE_API_BASE_URL=http://localhost:3000
VITE_PROD_BASE_URL=https://your-backend.onrender.com

🖥 Run project locally
1. Backend
cd backend
npm install
npm run dev


Server chạy tại:

http://localhost:3000

2. Frontend
cd frontend
npm install
npm run dev


Frontend chạy tại:

http://localhost:5173

🌐 Deployment
Frontend – Vercel

Build command: npm run build

Output directory: dist

Thêm file vercel.json để fix React Router 404:

{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}

Backend – Render

Add Environment Variables:

MONGO_URI

JWT_SECRET

Start command:

npm start


Render tự cấp PORT

🔌 API Endpoints (sample)
POST /auth/register
POST /auth/login

GET /quizzes
GET /quizzes/:id
POST /quizzes
PUT /quizzes/:id
DELETE /quizzes/:id

📸 Screenshots (optional)

(Bạn có thể thêm sau nếu muốn)

🧑‍💻 Author

Nguyễn Công Trí
MERN Stack Developer

⭐ If you like this project, give it a star!
