# Developer Backend — REST API

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/Authentication-JWT-orange)
![Render](https://img.shields.io/badge/Render-Deployed-46E3B7?logo=render)

A REST API built with Node.js, Express.js and PostgreSQL, powering a full-stack Task Manager application with JWT authentication and private user-specific task management.

## Live Deployment

- [Backend API](https://developer-backend-lavp.onrender.com)
- [Health Check](https://developer-backend-lavp.onrender.com/api/health)
- [Frontend Application](https://task-manager-app-five-virid.vercel.app)
- [Frontend Repository](https://github.com/Indrajthakur/Task-manager-app)

## Features

- User registration and login
- JWT-based authentication
- Bcrypt password hashing
- PostgreSQL cloud database
- RESTful CRUD operations
- Task priorities and deadlines
- User-specific data isolation
- Authentication rate limiting
- CORS configuration
- Environment-based secrets
- Server health monitoring

## Project Structure

```text
developer-backend/
├── middleware/
│   ├── auth.js
│   └── jwtAuth.js
├── routes/
│   ├── auth.js
│   └── tasks.js
├── db.js
├── init-db.js
├── server.js
├── package.json
├── .gitignore
└── README.md
```

## API Endpoints

| Method | Endpoint | Authentication |
|---|---|---|
| GET | / | Public |
| GET | /api/health | Public |
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/tasks | JWT |
| POST | /api/tasks | JWT |
| PUT | /api/tasks/:id | JWT |
| DELETE | /api/tasks/:id | JWT |

Protected endpoints require the following header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

## Installation

```bash
git clone https://github.com/Indrajthakur/developer-backend.git
cd developer-backend
npm install
```

## Environment Variables

Create a local `.env` file:

```env
PORT=5000
DATABASE_URL=your_postgresql_connection_url
JWT_SECRET=your_secure_random_secret
FRONTEND_URL=your_frontend_url
```

Use a PostgreSQL connection compatible with the SSL configuration in `db.js`.

Never commit your `.env` file or expose database credentials and JWT secrets.

## Initialize the Database

```bash
node init-db.js
```

## Start the Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The local API will be available at http://localhost:5000.

## Security

- Parameterized SQL queries
- Password hashing using bcrypt
- JWT signature and expiration verification
- User-level authorization
- Rate-limited authentication endpoints
- Restricted cross-origin browser access
- Request body size limits

## Testing

Manually tested user registration, login, task creation, task editing, completion status, user isolation and live frontend integration.

## Future Improvements

- Automated integration testing
- Refresh token management
- Email verification
- Password recovery
- API documentation using Swagger
- Database connection monitoring
- Persistent production database hosting

## Author

**Indraraj Singh Thakur**

Computer Science Student | Web Developer

[GitHub](https://github.com/Indrajthakur)

---

Built to demonstrate backend engineering, REST API development, database management and full-stack application deployment.