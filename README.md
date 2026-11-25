# Task Manager — Full Stack Web Application

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-Backend-000000?logo=express)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-4169E1?logo=postgresql&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)
![Render](https://img.shields.io/badge/Render-Backend-46E3B7?logo=render)

A modern full-stack task management application built with JavaScript, Node.js, Express and PostgreSQL. Designed to help users organize tasks, manage deadlines and track productivity through an intuitive dashboard.

## Live Demo

- [Launch Application](https://task-manager-app-five-virid.vercel.app)
- [Backend API](https://developer-backend-lavp.onrender.com)
- [Backend Repository](https://github.com/Indrajthakur/developer-backend)

## Features

- Secure user registration and login
- JWT-based authentication
- Bcrypt password hashing
- Private user-specific tasks
- Create, edit and delete tasks
- Task priorities and due dates
- Task completion tracking
- Real-time dashboard statistics based on loaded tasks
- Search and filtering
- Dark and light themes
- Responsive interface
- Cloud database persistence

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML5, CSS3, JavaScript |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Authentication | JWT, bcrypt |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Version Control | Git & GitHub |

## Architecture

Frontend → REST API → JWT Middleware → PostgreSQL

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Authenticate user |
| GET | /api/tasks | Retrieve private tasks |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |
| GET | /api/health | Server health check |

## Security

- Password hashing
- JWT token verification
- User-level data isolation
- Parameterized SQL queries
- Authentication rate limiting
- CORS configuration
- Environment-based secrets

## Run Locally

```bash
git clone https://github.com/Indrajthakur/Task-manager-app.git
cd Task-manager-app
npx serve . -l 3000
```

Open http://localhost:3000/auth.html.

## Future Improvements

- Email verification
- Password recovery
- Recurring tasks
- Calendar integration
- Productivity analytics
- Task collaboration
- Automated API testing

## Author

**Indraraj Singh Thakur**

Computer Science Student | Web Developer

[GitHub](https://github.com/Indrajthakur) · [LinkedIn](https://www.linkedin.com/in/indraraj-thakurr-2a590a3b1)

---

Built from scratch with a focus on full-stack development, security and user experience.