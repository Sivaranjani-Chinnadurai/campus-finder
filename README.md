# Campus Finder: Distributed Lost & Found Management System

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-38B2AC?logo=tailwind-css)

Campus Finder is a full-stack, component-driven web application architected to streamline the tracking and recovery of lost items within university campuses and large enterprise environments. The system implements a modern MERN-like stack (MongoDB, Express, React, Node.js) operating over a RESTful API architecture.

## 🏗️ System Architecture

The application is divided into two distinct, decoupled environments to ensure high maintainability and horizontal scalability.

### 1. Client-Side (Frontend)
- **Framework:** React 18 orchestrated by the Vite build tool for optimized HMR (Hot Module Replacement) and minimal bundle sizes.
- **Styling Methodology:** Utility-first CSS via **Tailwind CSS**, implementing advanced styling paradigms such as CSS Backdrop Filters (Glassmorphism) and responsive CSS Grid alignments.
- **State Management:** Functional components utilizing React Hooks (`useState`, `useEffect`) alongside simulated SPA (Single Page Application) routing.
- **Resilience:** Implements a graceful degradation strategy—if the upstream REST API is unreachable, the UI seamlessly transitions to an immutable local mock-data store to maintain interface operability.

### 2. Server-Side (Backend)
- **Runtime & Router:** Node.js environment utilizing the Express.js framework for asynchronous, non-blocking I/O operations.
- **Database ORM:** Mongoose ODM used for schema validation, data casting, and business logic enforcement.
- **CORS & Middleware:** Configured with Cross-Origin Resource Sharing (CORS) security headers and native JSON body parsing middleware.

---

## ⚙️ Core Features

- **Entity Management:** Full CRUD operations on `Post` models (Create, Read, Update, Delete).
- **Advanced Filtering Engine:** Real-time client-side array filtering mechanisms mapping to dataset attributes (`type`, `category`).
- **Interactive Data Modals:** Contextual z-index overlays with state-driven event propagation cancellation to prevent layout shifting.
- **Authentication Simulation:** User session mocking driving conditional UI rendering (Owner vs. Guest view access controls).
- **Status Lifecycle:** Items transition dynamically through lifecycle states (`active` -> `resolved`), utilizing HTTP `PUT` requests to commit logical state mutations.

---

## 🗄️ REST API Endpoints

The backend exposes the following RESTful interfaces (Default URI: `http://localhost:5000/api/posts`):

| Method | Endpoint      | Description | Payload Requirement |
| ------ | ------------- | ----------- | ------------------- |
| `GET`  | `/api/posts`  | Retrieves a chronological collection of post documents. Supports query params (e.g., `?type=lost`). | None |
| `POST` | `/api/posts`  | Instantiates a new post document. | `title`, `description`, `type`, `category`, `location`, `date`, `contact` |
| `PUT`  | `/api/posts/:id` | Mutates an existing document. Used primarily for transitioning document `status` to `resolved`. | Object payload (`{ status: 'resolved' }`) |
| `DELETE`| `/api/posts/:id`| Hard-deletes a specific document from the MongoDB collection. | None |

---

## 🛠️ Local Development & Setup Guide

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v16.x or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local instance running on port 27017, or a valid Atlas cluster URI)
- [Git](https://git-scm.com/)

### Installation Sequence

**1. Clone the repository**
```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd lost-and-found
```

**2. Initialize the Database Server**
```bash
cd server
# Install backend dependencies
npm install

# (Optional) Create a .env file and define MONGODB_URI if not using local default
# MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/lostandfound

# Initialize the Express listener
npm run dev
```

**3. Initialize the Client Application**
Open a secondary terminal session:
```bash
cd client
# Install frontend dependencies (Vite, React, Tailwind)
npm install

# Boot the Vite development server
npm run dev
```

The localized environment will mount at:
- **Client Application:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`

---

## 📂 Repository Structure

```text
lost-and-found/
├── client/                     # Vite + React Environment
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── App.jsx             # Root React component and monolithic state controller
│   │   ├── main.jsx            # DOM entrypoint
│   │   └── index.css           # Global Tailwind directives & Glassmorphism layers
│   ├── package.json            # Client dependencies
│   ├── tailwind.config.js      # Tailwind compiler specifications
│   └── vite.config.js          # Vite build orchestrator
├── server/                     # Node.js + Express Environment
│   ├── models/
│   │   └── Post.js             # Mongoose Schema definitions
│   ├── routes/
│   │   └── posts.js            # Express router controllers
│   ├── package.json            # Server dependencies
│   └── server.js               # Application bootstrap and database connector
├── .gitignore
└── README.md
```

## 📄 License
This project is licensed under the MIT License.
