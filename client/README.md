# Job & Internship Marketplace

A full-stack MERN web application that connects students with companies for job and internship opportunities.

## 📌 Project Overview

The **Job & Internship Marketplace** is a web-based platform designed to make the job and internship application process easier for students and companies.

Students can create accounts, build their profiles, search for opportunities, apply for jobs, and track their applications.

Companies can create accounts, post job and internship opportunities, view applicants, and update application statuses.

The project also includes an **Admin Dashboard** for monitoring users and marketplace activities.

---

## 🚀 Main Features

### 👨‍🎓 Student Features

* Student registration and login
* Student profile management
* Browse jobs and internships
* Search jobs
* Filter opportunities by type and category
* View complete job details
* Apply for jobs
* Submit cover letters
* Track submitted applications
* View application status

### 🏢 Company Features

* Company registration and login
* Company profile
* Create job and internship postings
* Edit job postings
* Delete job postings
* View applicants
* View applicant information
* Update application status
* Shortlist applicants
* Accept or reject applications

### 🛡️ Admin Features

* Secure admin login
* Admin dashboard
* View total users
* View students
* View companies
* View administrators
* View available jobs
* Monitor marketplace users

---

## 🛠️ Technologies Used

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Vite
* Axios

### Backend

* Node.js
* Express.js
* REST API
* JWT Authentication
* bcryptjs
* CORS

### Database

* MongoDB
* MongoDB Atlas
* Mongoose

---

## 🏗️ Project Architecture

```text
Job & Internship Marketplace
│
├── client
│   ├── src
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── ...
│   │
│   ├── public
│   ├── package.json
│   └── ...
│
└── server
    ├── models
    │   ├── User.js
    │   ├── JobTemp.js
    │   └── Application.js
    │
    ├── .env
    ├── server.js
    └── package.json
```

---

## 🔐 Authentication & Security

The application uses JWT-based authentication.

Important security features include:

* Password hashing using bcryptjs
* JWT authentication
* Protected API routes
* Role-based authorization
* Student-only application routes
* Company-only job management routes
* Admin-only user management
* Authentication middleware
* User account status checking
* Duplicate application prevention

---

## 👥 User Roles

The application supports three main roles:

| Role    | Main Responsibilities           |
| ------- | ------------------------------- |
| Student | Search and apply for jobs       |
| Company | Post jobs and manage applicants |
| Admin   | Monitor users and marketplace   |

---

## 🔄 Application Workflow

```text
Student
   ↓
Register / Login
   ↓
Browse Jobs
   ↓
Search / Filter
   ↓
View Job Details
   ↓
Apply
   ↓
Track Application
   ↓
Application Status
```

Company workflow:

```text
Company
   ↓
Register / Login
   ↓
Create Job
   ↓
Receive Applications
   ↓
View Applicants
   ↓
Update Status
   ↓
Shortlisted / Accepted / Rejected
```

---

## 📡 Main API Modules

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
PUT  /api/auth/profile
```

### Jobs

```text
GET    /api/jobs
GET    /api/jobs/:id
POST   /api/jobs
PUT    /api/jobs/:id
DELETE /api/jobs/:id
```

### Applications

```text
POST /api/applications
GET  /api/applications/my
GET  /api/applications/job/:jobId
PUT  /api/applications/:id/status
```

### Admin

```text
GET /api/check-users
```

The admin endpoint is protected using authentication and role-based authorization.

---

## 💻 Requirements

Before running the project, install:

* Node.js
* npm
* MongoDB Atlas account
* Visual Studio Code or another code editor
* Modern web browser

---

## ▶️ How to Run the Project

### 1. Open the project

```text
job-internship-marketplace
```

### 2. Start the backend

Open a terminal inside:

```text
client/server
```

Run:

```bash
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### 3. Start the frontend

Open another terminal inside:

```text
client
```

Run:

```bash
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

## 🗄️ Database

The project uses MongoDB Atlas to store:

* User accounts
* Student profiles
* Company profiles
* Job postings
* Applications
* Application statuses

Mongoose is used to communicate between the Node.js backend and MongoDB.

---

## 📊 Application Status

Applications can have the following statuses:

```text
Applied
Shortlisted
Rejected
Accepted
```

---

## 🎯 Project Objectives

The main objectives of this project are:

1. Create a centralized platform for jobs and internships.
2. Help students find suitable opportunities.
3. Allow students to apply online.
4. Allow companies to manage job postings.
5. Allow companies to manage applicants.
6. Provide application status tracking.
7. Implement secure user authentication.
8. Implement role-based access control.
9. Demonstrate full-stack MERN development.
10. Build a practical project suitable for real-world learning.

---

## 📚 Learning Outcomes

Through this project, the following technologies and concepts were practiced:

* React component development
* React state management
* API integration
* Axios
* REST API development
* Express.js
* Node.js
* MongoDB
* Mongoose
* JWT authentication
* Password hashing
* Role-based authorization
* CRUD operations
* Database relationships
* Frontend and backend integration
* Error handling
* Responsive UI development

---

## 🔮 Future Scope

Future versions can include:

* Saved/bookmarked jobs
* Advanced job filters
* Resume upload
* Email notifications
* Application notifications
* Company verification
* Admin job moderation
* Analytics dashboard
* AI-based job recommendations
* Resume skill extraction
* Real-time chat
* Socket.IO integration
* TypeScript migration
* Cloud deployment

---

## 👨‍💻 Project Type

**Academic / College Project**

**Technology:** MERN Stack

**Domain:** Job & Internship Marketplace

**Development Type:** Full-Stack Web Application

---

## ⭐ Conclusion

The Job & Internship Marketplace demonstrates how a modern full-stack web application can connect students and companies through a single platform.

The project combines a React frontend, Node.js and Express backend, MongoDB database, authentication, authorization, job management, application tracking, and an administrative dashboard into one complete application.
