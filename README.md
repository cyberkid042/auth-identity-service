# Auth Identity Service

🔐 **A lightweight authentication and authorization service built with Node.js and Passport.js.**

Supports JWT-based authentication, role-based access control (RBAC), and secure session handling. Demonstrates industry best practices for identity management and API security.

## Core Features

- User registration & login (with hashed passwords using bcrypt)
- JWT authentication with refresh tokens
- Role-based authorization (e.g., admin, user)
- Protected API routes with middleware
- Session expiration handling
- Simple user CRUD endpoints
- Unit tests for authentication flows

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/cyberkid042/auth-identity-service.git
   cd auth-identity-service
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env` and fill in your secrets:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` with your preferred settings (see below for sample).

### Running Locally

Start the development server:
```bash
npm run dev
```

The API will be available by default at `http://localhost:3000`.

### Sample .env
```
NODE_ENV=development
PORT=3000
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
SESSION_SECRET=your_session_secret
DB_PATH=./authdb.sqlite
```

### Database

This project uses SQLite for local development. The database file will be created at the path specified by `DB_PATH` in your `.env` file (default: `./authdb.sqlite`).

No additional setup is required for SQLite. The database will be initialized automatically when you run the server.

## Project Structure

```
├── src/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
├── tests/
├── .env.example
├── package.json
└── README.md
```

## License

MIT
