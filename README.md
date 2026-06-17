# SmartCare – Smart Healthcare. Seamless Appointments. Digital Queue Management.

SmartCare is a premium, full-stack Healthcare Appointment scheduling and dynamic Queue Management System. It replaces traditional patient waiting lobbies with real-time digital consultation tracking, sequantial SC-coded tokens, and comprehensive role-based dashboards for Patients, Doctors, and Administrators.

---

## 🚀 Key Architectural Strengths

### 1. Unified Full Stack Topology
*   **Web Portal**: Designed using modern React with ESM JavaScript, styled with Tailwind CSS, and animated with Framer Motion transitions. The design employs a high-contrast Medical Blue, Emerald Green, and Warm White glassmorphism aesthetic.
*   **Fullstack Gateway**: Express + Vite proxy routing engine to feed JSON packets dynamically during local execution.
*   **Production Microservice**: Modular Spring Boot architecture with Spring Data JPA persistence and JWT Security profiles.

### 2. High-Fidelity Queue Mathematics
*   **SC-Coded Tokens**: Assigned sequentially (e.g., `SC001`, `SC002`) based on the reservation queue status of the designated specialist.
*   **Dynamic Metrics**: Real-time evaluation of estimated wait times (configured at 15 minutes per patient) and live updates as clinicians trigger "Call Next Patient" from their portals.

---

## 📂 Complete Project Structure

```text
/
├── backend/                       # Java Spring Boot Microservice
│   ├── controller/                # AuthController, QueueController, PatientController...
│   ├── model/                     # JPA Entities (User, Doctor, Appointment, Queue)
│   ├── repository/                # Spring JpaRepositories
│   ├── service/                   # AuthService, QueueService, AppointmentService, EmailService
│   ├── security/                  # JwtAuthenticationFilter, JwtUtil, SecurityConfig
│   ├── dto/                       # LoginRequest, RegisterRequest DTOs
│   ├── exception/                 # GlobalExceptionHandler advice
│   ├── config/                    # CorsConfig configurations
│   ├── SmartcareApplication.java  # Main Boot loader class
│   └── application.yml            # Core database & port configurations
│
├── src/                           # React Interactive client
│   ├── components/                # Navbar, Sidebar, Topbar, DoctorCard, QueueStatusCard...
│   ├── context/                   # AuthContext sessions provider
│   ├── pages/                     # Home, Services, About, Login, Register, Dashboards...
│   ├── services/                  # axios configuration, doctorService, queueService...
│   ├── utils/                     # constants (doctors catalogs), helper formatting utils
│   ├── App.jsx                    # Primary Router and Protected Router Guards
│   ├── index.css                  # Tailwind variables & Google Font linkages
│   └── main.jsx                   # React bootloader
│
│── package.json                   # Full-stack Node package manifest
│── server.ts                      # Express API mock server (Active on Sandbox preview)
└── POSTMAN_COLLECTION.json        # Unified API request collections for developers
```

---

## 📡 Complete REST API Endpoints Registry

| End Point | Method | Required Scope / Auth | Description |
| :--- | :--- | :--- | :--- |
| `/api/auth/register` | `POST` | Public | Registers a new patient profile inside the persistent database |
| `/api/auth/login` | `POST` | Public | Submits credentials and yields a persistent Authorization JWT Bearer Token |
| `/api/doctors` | `GET` | Public | Retrieves roster records for all clinical departments |
| `/api/doctors` | `POST` | Admin Only | Appends a new medical officer card |
| `/api/doctors/{id}` | `DELETE`| Admin Only | Purges a doctor from active medical registers |
| `/api/appointments` | `POST` | Patient / JWT | Schedules a consultation and issues a sequential `SC` queue token |
| `/api/appointments` | `GET` | JWT Checked | Filters active appointments by `patientId` or `doctorId` |
| `/api/queue` | `GET` | Public / JWT | Fetches active diagnostic queue levels for clinical rooms |
| `/api/queue/next` | `PUT` | Doctor / JWT | Increments status to NEXT patient, alerting client portals |
| `/api/queue/complete`| `PUT` | Doctor / JWT | Moves currently consulting token status to `COMPLETED` |
| `/api/queue/skip` | `PUT` | Doctor / JWT | Flags patient as absent, moving active token status to `SKIPPED` |

---

## 💾 Core Persistence Schemes

### 1. In-Memory Development Database (H2)
The development profile has active H2 support for fast data cycle testing.
*   **H2 Endpoint Console**: `http://localhost:8080/h2-console`
*   **JDBC Driver Class**: `org.h2.Driver`
*   **JDBC Database URL**: `jdbc:h2:mem:smartcare_db`
*   **Superuser Creds**: `username: sa`, `password: password`

### 2. Production Database (MySQL)
To switch to a persistent database engine (e.g. MySQL) in production environments:
1.  Uncomment the MySQL parameters inside `backend/application.yml`.
2.  Enable the corresponding connector dependency in Maven `pom.xml`.
3.  Set database schemas to self-generate or ddl-update.

---

## 🛠️ Step-By-Step Development Execution

### Part 1: Booting the Frontend Client & Proxy Server
1.  Verify the Node.js packages are resolved:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```
    *This runs the full Express API layer on port `3000` alongside Vite, giving you a functional real-time testing sandbox.*

### Part 2: Starting the Spring Java Microservice
1.  Move into your Spring Boot directory.
2.  Build and package executable components using Maven wrapper protocols:
    ```bash
    mvn clean package
    ```
3.  Boot up the application:
    ```bash
    mvn spring-boot:run
    ```
    *The Java backend launches on standard port `8080`, supporting active database updates and API requests.*
