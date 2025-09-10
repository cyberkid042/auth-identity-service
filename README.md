# Auth Identity Service

🔐 **A lightweight authentication and authorization service built with Node.js and TypeScript.**

Supports JWT-based authentication, role-based access control (RBAC), secure session handling, and comprehensive logging. Demonstrates industry best practices for identity management and API security.

## Core Features

- User registration & login (with hashed passwords using bcrypt)
- JWT authentication with refresh tokens
- Role-based authorization (e.g., admin, user)
- Protected API routes with middleware
- Session expiration handling
- Simple user CRUD endpoints
- Comprehensive logging with Winston
- Error handling middleware
- Unit tests for authentication flows

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite with Sequelize ORM
- **Authentication**: JWT (jsonwebtoken)
- **Password Security**: bcrypt
- **Logging**: Winston
- **Testing**: Jest with Supertest
- **Code Quality**: ESLint, Prettier

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

### Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Sample .env
```
NODE_ENV=development
PORT=3000
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
DB_PATH=./authdb.sqlite
```

### Database

This project uses SQLite for local development. The database file will be created at the path specified by `DB_PATH` in your `.env` file (default: `./authdb.sqlite`).

For testing, a separate database (`./test-authdb.sqlite`) is automatically created and managed.

No additional setup is required for SQLite. The database will be initialized automatically when you run the server.

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT tokens
- `POST /auth/refresh` - Refresh access token
- `GET /auth/profile` - Get user profile (protected)

### User Management (Admin only)
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Admin
- `GET /admin/dashboard` - Admin dashboard (admin only)

## Project Structure

```
├── src/
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth, RBAC, logging, error handling
│   ├── models/            # Database models (Sequelize)
│   ├── routes/            # API route definitions
│   ├── utils/             # Utility functions (logger)
│   ├── __tests__/         # Unit tests
│   └── index.ts           # Application entry point
├── .env.example           # Environment variables template
├── jest.config.js         # Jest configuration
├── tsconfig.json          # TypeScript configuration
├── package.json
└── README.md
```

## Testing Coverage

The test suite includes:
- Authentication controller tests (register, login, profile access)
- User controller tests (CRUD operations, admin access)
- Middleware tests (JWT authentication, RBAC)
- Integration tests for protected routes

## Security Features

- Password hashing with bcrypt
- JWT token expiration and refresh
- Role-based access control
- Input validation and sanitization
- Secure error handling (no sensitive data leakage)
- Request logging for audit trails

## License

MIT
