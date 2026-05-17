# Hospital Management System

A full-stack web application designed to manage core hospital operations such as patient records, doctor management, appointment scheduling, billing, and revenue tracking.

-->Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Recharts, Lucide Icons |
| Backend | Spring Boot, Spring Security |
| Database | PostgreSQL |
| Authentication | JWT Authentication |

---

--> Features

- Role-based access control for Admin, Doctor, and Patient
- Secure JWT-protected authentication and authorization
- Patient self-registration with automatic patient profile creation
- Doctor management and credential creation by admin
- Appointment booking with doctor/date/time selection
- Validation to prevent booking appointments in the past
- Billing management with bill generation and payment status update
- Monthly revenue analytics dashboard for admin
- Separate dashboards for Admin, Doctor, and Patient
- Data isolation to ensure users can access only their own records

---

--> Default Admin Login

```text
Username: admin
Password: adminpass
```

---

--> Database Setup

Create a PostgreSQL database named:

```sql
hospital_db
```

Update database credentials in:

```properties
src/main/resources/application.properties
```

Example configuration:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/hospital_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```
--->Running Locally

--->Backend Setup

```bash
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8081
```

-->Frontend Setup

```bash
cd hospital-frontend
npm install
npm start
```

Frontend runs on:

http://localhost:3000

-->Backend Dependencies

- Spring Web
- Spring Data JPA
- Spring Security
- PostgreSQL Driver
- JWT
- Lombok

---

--->API Endpoints

-->Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register patient |
| POST | `/api/auth/login` | Public | User login |
| POST | `/api/auth/register-doctor` | ADMIN | Create doctor login |

---

-->Patients

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/patients` | ADMIN | Get all patients |
| POST | `/api/patients` | ADMIN | Add patient |
| DELETE | `/api/patients/{id}` | ADMIN | Delete patient |
| GET | `/api/patients/by-name/{name}` | AUTHENTICATED | Get patient by name |

---

-->Doctors

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/doctors` | AUTHENTICATED | Get all doctors |
| POST | `/api/doctors` | ADMIN | Add doctor |
| DELETE | `/api/doctors/{id}` | ADMIN | Delete doctor |
| GET | `/api/doctors/by-name/{name}` | AUTHENTICATED | Get doctor by name |

---

-->Appointments

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/appointments` | ADMIN | Get all appointments |
| POST | `/api/appointments` | AUTHENTICATED | Book appointment |
| GET | `/api/appointments/by-patient/{id}` | PATIENT | Get patient appointments |
| GET | `/api/appointments/by-doctor/{id}` | DOCTOR | Get doctor appointments |

---

-->Billing

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/billing` | ADMIN | Get all bills |
| POST | `/api/billing/{appointmentId}` | AUTHENTICATED | Generate bill |
| GET | `/api/billing/by-patient/{id}` | PATIENT | Get patient bills |
| POST | `/api/billing/pay/{id}` | PATIENT | Mark bill as paid |

---


