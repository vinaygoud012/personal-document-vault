# Personal Document Vault

## 🏗 Project Overview
The **Personal Document Vault** is a secure, enterprise-level web application designed to allow users to store, organize, and manage important personal documents (IDs, certificates, bills, etc.) in the cloud. It features robust security with JWT authentication, role-based access control, and document encryption.

## 🚀 Key Features
- **Secure Authentication**: User registration and login using Spring Security + JWT.
- **Document Management**: Upload, view, download, and delete documents.
- **Encryption**: Documents are encrypted before storage for maximum security.
- **Activity Logging**: Tracks all user actions (uploads, deletions, logins) for audit purposes.
- **Responsive UI**: Built with vanilla HTML/CSS/JS for a clean, fast, and responsive experience.
- **Dockerized**: Ready for deployment with Docker and Docker Compose.

## 🧱 Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Java 17, Spring Boot 3.2
- **Database**: MySQL 8.0
- **Security**: Spring Security, JWT (JSON Web Tokens)
- **Build Tool**: Maven
- **Containerization**: Docker, Docker Compose

## ⚙️ Setup & Run Instructions

### Prerequisites
- Java 17+
- Maven
- Docker & Docker Compose (optional but recommended)
- MySQL (if running locally without Docker)

### Option 1: Run with Docker (Recommended)
1.  Clone the repository.
2.  Navigate to the project root.
3.  Run:
    ```bash
    docker-compose up --build
    ```
4.  Access the application at `http://localhost:8080`.

### Option 2: Run Locally
1.  Ensure MySQL is running and create a database named `document_vault`.
2.  Update `src/main/resources/application.properties` with your MySQL credentials.
3.  Run the application:
    ```bash
    mvn spring-boot:run
    ```
4.  Access the application at `http://localhost:8080`.

## 🧩 API Documentation

### Authentication
- **POST** `/api/auth/signup`: Register a new user.
    - Body: `{ "username": "user", "email": "user@test.com", "password": "password" }`
- **POST** `/api/auth/signin`: Login.
    - Body: `{ "username": "user", "password": "password" }`

### Documents
- **POST** `/api/documents/upload`: Upload a file.
    - Form Data: `file` (MultipartFile), `tags` (String)
    - Header: `Authorization: Bearer <token>`
- **GET** `/api/documents`: List all documents.
    - Header: `Authorization: Bearer <token>`
- **GET** `/api/documents/{id}`: Download a document.
    - Header: `Authorization: Bearer <token>`
- **DELETE** `/api/documents/{id}`: Delete a document.
    - Header: `Authorization: Bearer <token>`

### Activity Log
- **GET** `/api/activity`: Get user activity log.
    - Header: `Authorization: Bearer <token>`

## 🗄 Database Schema (ER Diagram Description)
- **users**: `id`, `username`, `email`, `password`
- **roles**: `user_id`, `roles`
- **documents**: `id`, `name`, `type`, `size`, `data` (BLOB), `upload_date`, `tags`, `user_id`, `encrypted`
- **activity_logs**: `id`, `action`, `details`, `timestamp`, `user_id`

Relationships:
- One User -> Many Documents
- One User -> Many ActivityLogs
- One User -> Many Roles

## 💼 Resume Highlights
- **Full-Stack Development**: Built an end-to-end application connecting a Spring Boot REST API with a custom vanilla JS frontend.
- **Security Implementation**: Implemented JWT-based stateless authentication and role-based authorization.
- **Data Privacy**: Demonstrated knowledge of data protection by implementing file encryption.
- **System Design**: Designed a clean 3-layer architecture (Controller-Service-Repository) following SOLID principles.
- **DevOps**: Containerized the application using Docker and Docker Compose for consistent deployment.
