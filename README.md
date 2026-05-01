# Alumni-referral-network
# Alumni Referral Network

Alumni Referral Network is a full-stack web application that connects students with alumni for mentorship, referral support, and career networking. The platform includes secure authentication, role-based dashboards, direct messaging, referral request tracking, and profile management.

## Features

- User authentication with login and registration
- Role-based access for Students, Alumni, and Admin
- Alumni directory and profile browsing for students
- Alumni profile setup and request management
- Messaging system for student-alumni communication
- Referral request creation, approval, and status tracking
- Admin dashboard for managing users and overall system activity
- Protected routes for secure access to private pages

## Tech Stack

- Frontend: React, Vite, React Router, React Hook Form, React Toastify
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: JSON Web Tokens (JWT)
- Utilities: Axios, CORS, dotenv, bcryptjs, express-validator

## Project Structure

- `client/` — React frontend
- `server/` — Express backend
- `server/models/` — MongoDB data models
- `server/controllers/` — Route handlers and business logic
- `server/routes/` — API route definitions
- `server/middleware/` — Authentication and authorization middleware

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd alumni-referral-network
