# Hospital Management System

A full-stack web application designed to streamline hospital operations by managing patients, doctors, appointments, billing, and revenue analytics through a secure role-based system.

## Live Demo

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://hospital-management-system-pi-mauve.vercel.app/login)

---

## Features

### Patient Management

* Patient self-registration
* Automatic patient profile creation
* Patient record management
* Secure access to personal medical information

### Doctor Management

* Doctor management by administrators
* Doctor credential creation
* Doctor-specific dashboard
* Appointment schedule management

### Appointment Management

* Book appointments with doctors
* Doctor, date, and time slot selection
* Prevention of appointments in the past
* Conflict detection to prevent overlapping appointments for doctors and patients
* 30-minute appointment slot scheduling

### Billing & Revenue

* Generate bills for completed appointments
* Track payment status
* Patient billing history
* Monthly revenue analytics dashboard

### Authentication & Security

* JWT-based Authentication
* Role-based Access Control (Admin, Doctor, Patient)
* Protected APIs and secure authorization
* Data isolation between users

### User Experience

* Separate dashboards for Admin, Doctor, and Patient
* Responsive user interface
* Interactive charts and analytics
* Easy appointment and billing management

---

## Tech Stack

| Layer          | Technology                    |
| -------------- | ----------------------------- |
| Frontend       | React, Recharts, Lucide Icons |
| Backend        | Spring Boot, Spring Security  |
| Database       | PostgreSQL                    |
| Authentication | JWT Authentication            |
| Build Tool     | Maven                         |

---

## Project Structure

```text
├── hospital-frontend/      # React frontend
├── src/
│   ├── main/
│   │   ├── java/
│   │   └── resources/
│   └── test/
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
```

---

## Getting Started

### Prerequisites

* Java 17 JDK
* Maven
* PostgreSQL
* Node.js and npm

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/Hospital-Management-System.git
cd Hospital-Management-System
```

### Database Setup

Create a PostgreSQL database:

```text
hospital_db
```

Update database credentials in:

```text
src/main/resources/application.properties
```

---

## Running Locally

### Backend

```bash
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8081
```

### Frontend

```bash
cd hospital-frontend
npm install
npm start
```

Frontend runs on:

```text
http://localhost:3000
```

---

## Default Admin Account

```text
Username: admin
Password: adminpass
```

---

## Deployment

### Backend

* Spring Boot deployment
* PostgreSQL database integration
* JWT-based authentication and authorization

### Frontend

* React deployment
* Connected to the deployed backend API


