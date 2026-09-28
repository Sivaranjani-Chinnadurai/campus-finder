# Campus Finder - Lost & Found Portal

A sleek, full-stack web application designed for college campuses to help students easily report and recover lost items.

## 🌟 Features
- **Modern UI**: Built with React and Tailwind CSS. Features a bright, soft "glassmorphism" aesthetic.
- **Full-Stack Architecture**: Node.js & Express backend integrated with a MongoDB database.
- **User Dashboard**: Login simulation, personal profile page, and post-management (Resolve / Delete).
- **Resilient**: Gracefully falls back to mock data if the database or API is temporarily offline.

## 📁 Project Structure
- `/client` - The Vite + React frontend environment.
- `/server` - The Node.js + Express + Mongoose backend API.

## 🚀 How to Run Locally

### 1. Start the Backend API
*Note: Ensure you have MongoDB installed and running locally, or set a `MONGODB_URI` environment variable.*
```bash
cd server
npm install
npm run dev
```
The server will start on `http://localhost:5000`.

### 2. Start the Frontend App
In a new terminal window:
```bash
cd client
npm install
npm run dev
```
The React app will be accessible at `http://localhost:5173`.
