<div align="center">

# SmartCare

### Healthcare Appointment & Queue Management System

A full-stack web application designed to digitize medical appointments, streamline healthcare workflows, and improve patient experience through live queue tracking and role-based management.

<p align="center">
  <a href="https://smartcare-healthcare-appointment-an.vercel.app/" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-Visit_Now-0ea5e9?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo"/>
  </a>
</p>

<p align="center">
  <a href="https://github.com/Poojita40/smartcare-appointment-queue-management" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github" alt="GitHub Repository"/>
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-success.svg?style=flat-square" alt="Status">
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat-square&logo=spring&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/H2_Database-005C84?style=flat-square" alt="H2 Database">
  <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel">
  <img src="https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=white" alt="Render">
</p>

</div>

---

# 🌐 Live Demo

### 🚀 Explore SmartCare

https://smartcare-healthcare-appointment-an.vercel.app/

---

# 📖 Project Overview

SmartCare is a healthcare appointment and queue management platform developed to simplify appointment scheduling and optimize healthcare operations.

The platform enables patients to book appointments online, receive queue tokens, track appointment status, and monitor queue progression. Clinical staff and administrators can efficiently manage appointments, patient information, schedules, and queue operations through dedicated dashboards.

The system helps reduce waiting times, improve transparency, and enhance the overall healthcare experience.

---

# ❗ Problem Statement

Traditional healthcare facilities often face several challenges:

* Long patient waiting times
* Overcrowded waiting rooms
* Lack of appointment visibility
* Manual scheduling processes
* Administrative inefficiencies
* Difficulty managing patient queues and doctor availability

These challenges impact both healthcare providers and patients, reducing operational efficiency and patient satisfaction.

---

# 💡 Solution

SmartCare provides a digital healthcare management solution that enables:

* Online appointment booking
* Automated queue token generation
* Live queue tracking
* Appointment status monitoring
* Secure role-based access
* Centralized management of healthcare workflows

Patients can monitor their queue status remotely and arrive closer to their consultation time, minimizing unnecessary waiting.

---

# ✨ Features

## 👨‍⚕️ Patient Features

* Patient Registration
* Secure Login
* Appointment Booking
* Queue Token Generation
* Queue Tracking
* Appointment Status Monitoring
* Email Notifications

### Patient Workflow

```text
Register
   ↓
Login
   ↓
Book Appointment
   ↓
Receive Queue Token
   ↓
Track Queue Status
```

---

## 👩‍⚕️ Clinical Staff Features

* Secure Login
* View Assigned Appointments
* Access Patient Details
* Manage Queue Progression
* Update Appointment Status
* Complete Consultations

### Clinical Staff Workflow

```text
Login
   ↓
View Appointments
   ↓
Review Patient Information
   ↓
Update Status
   ↓
Complete Consultation
```

---

## 🛡️ Admin Features

* Patient Management
* Clinical Staff Management
* Appointment Management
* Queue Administration
* System Monitoring
* Administrative Controls

### Admin Workflow

```text
Login
   ↓
Manage Patients
   ↓
Manage Staff
   ↓
Manage Appointments
   ↓
Manage Queue
```

---

## 💻 System Features

* Role-Based Access Control
* Queue Management
* Appointment Scheduling
* Live Queue Tracking
* Email Notifications
* Secure Authentication
* Dashboard Management
* Responsive User Interface

---

# 👥 User Roles

| Role                 | Responsibilities                                           |
| -------------------- | ---------------------------------------------------------- |
| 👨‍⚕️ Patient        | Register, Login, Book Appointments, Track Queue            |
| 👩‍⚕️ Clinical Staff | Manage Appointments, Update Status, Complete Consultations |
| 🛡️ Admin            | Manage Patients, Staff, Appointments, Queue                |
| 💻 Developer         | Testing, Monitoring, Maintenance                           |

---

# 🛠️ Technology Stack

| Category        | Technologies                                           |
| --------------- | ------------------------------------------------------ |
| Frontend        | React.js, Vite, Material UI (MUI), Tailwind CSS, Axios |
| Backend         | Java, Spring Boot 3, Spring Security, Spring Data JPA  |
| Database        | H2 Database                                            |
| Authentication  | Role-Based Access Control                              |
| Deployment      | Vercel, Render                                         |
| Version Control | Git, GitHub                                            |

---

# 🏗️ System Architecture

```mermaid
graph TD

A[Patient / Staff / Admin Browser]
--> B[React Frontend]

B --> C[REST API Calls]

C --> D[Spring Boot Backend]

D --> E[Spring Security]

E --> F[Controllers]

F --> G[Service Layer]

G --> H[JPA Repositories]

H --> I[(H2 Database)]
```

---

# 📂 Project Structure

```text
📦 SmartCare
│
├── 📂 backend
│   ├── 📂 controller
│   ├── 📂 service
│   ├── 📂 repository
│   ├── 📂 model
│   ├── 📂 dto
│   ├── 📂 config
│   ├── 📂 security
│   └── 📜 pom.xml
│
├── 📂 frontend
│   ├── 📂 public
│   ├── 📂 src
│   │   ├── 📂 components
│   │   ├── 📂 pages
│   │   ├── 📂 services
│   │   ├── 📂 context
│   │   ├── 📂 assets
│   │   └── 📂 layouts
│   │
│   ├── 📜 package.json
│   └── 📜 vite.config.js
│
└── 📜 README.md
```

---

# 🔗 Quick Access

### 🌐 Live Application

https://smartcare-healthcare-appointment-an.vercel.app/

### 📂 GitHub Repository

https://github.com/Poojita40/smartcare-appointment-queue-management

---

# ⚙️ Installation Guide

## Prerequisites

* Java JDK 17+
* Maven 3.8+
* Node.js 18+
* Git

### Clone Repository

```bash
git clone https://github.com/Poojita40/smartcare-appointment-queue-management.git
cd smartcare-appointment-queue-management
```

### Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend URL:

```text
http://localhost:8081
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# 🔒 Security Features

* Role-Based Access Control (RBAC)
* Protected Routes
* Session Management
* BCrypt Password Encryption
* Input Validation
* CORS Protection
* Secure Authentication

---

# 🎯 Project Objectives

* Reduce patient waiting times
* Improve healthcare operational efficiency
* Digitize appointment workflows
* Provide queue transparency
* Simplify administrative operations
* Enhance patient experience

---

# 🚀 Future Enhancements

* WebSocket-Based Real-Time Queue Updates
* Telemedicine Integration
* Online Payment Gateway
* Digital Prescriptions
* Medical Records Management
* SMS Notifications
* Multi-Hospital Support
* Analytics Dashboard

---

# 👩‍💻 Developer

### Poojita Lakkakula

B.Tech Computer Science Student
Anurag University

### GitHub

https://github.com/Poojita40

### Repository

https://github.com/Poojita40/smartcare-appointment-queue-management

### Live Demo

https://smartcare-healthcare-appointment-an.vercel.app/

---

<div align="center">

### SmartCare — Making Healthcare Appointments Smarter and Simpler

Made with by Poojita Lakkakula

</div>
