# Blog API

A robust, scalable **RESTful API** for a social microblogging platform (like Twitter) built using **Node.js**, **TypeScript**, **Sequelize**, and **PostgreSQL**. Includes full **authentication**, **follower graph**, **micro-posts**, **likes**, **notifications**, **avatar upload**, **pagination**, and **testing**.

## Features

- JWT-based Auth (Access + Refresh Token) with Role Support
- Public Profile, Private Edit, Avatar Upload, Change Password
- Follow/Unfollow, Get Followers/Following, Pagination Support
- 280-character limit, Media URL support, Replies (Flat + Nested)
- Like/Unlike for Posts, View Who Liked
- Background Worker via BullMQ + Redis, Like Notifications
- Global Feed with Pagination + Optional Filtering
- Posts from Following + Self
- Validation using Zod
- Jest for Auth, Users, Follow System, and Posts
- Fully documented using `swagger.yaml`
- Clean architecture (controllers, services, repositories)
- Multer integration for avatar handling
- Type-safe with TypeScript

---

## Tech Stack

- Node.js + Express
- TypeScript
- Sequelize ORM
- PostgreSQL (production) / SQLite (test)
- Redis + BullMQ (background jobs)
- JWT + Refresh Tokens
- Zod (validation)
- Jest (testing)
- Multer (file uploads)
- Swagger (OpenAPI docs)

---

## Installation

```bash
git clone https://github.com/yaya-soumah/mini-social-api.git
cd blog-api
```

# Install dependencies

```bash
npm install
```

# Create a .env file from .env.example

Example .env

```bash
NODE_ENV=development
PORT=8080
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=mini-social
DB_USER=postgres
DB_PASS=your-password
TEST_DB_STORAGE=:memory:
ACCESS_TOKEN_SECRET=your-secret-code
REFRESH_TOKEN_SECRET="your-refresh-secret-code"
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
```

# Run Migrations

```bash
npm run migrate
```

# Build the project

```bash
npm run build
```

# Run Worker(for Notifications)

// Make sure that Redis server is running

```bash
npm run start:worker
```

# Run the dev server

```bash
npm run dev
```

# Run Tests

```bash
npm run tests
```

# API Documentation

Swagger UI available at:

- **Swagger UI**: [View Live Docs](https://mini-social-api-u0gb.onrender.com/api-docs)
- **Base URL**: `https://mini-social-api-u0gb.onrender.com/api/v1`

# Author

Yaya Soumah — [LinkedIn](www.linkedin.com/in/yaya-soumah-11b75b1b9) | Backend Developer
