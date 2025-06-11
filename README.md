# Multi-Level Comment System API

A robust, production-ready REST API built with **Express** and **TypeScript**, designed for a **multi-level comment system**. This includes essential features like centralized error handling, request logging, rate limiting, request context, health checks, MongoDB integration, JWT authentication, and Docker support.

This template accelerates API development and follows best practices with scalable and maintainable architecture.

---

## Table of Contents

* [Features](#features)
* [Getting Started](#getting-started)
* [Project Structure](#project-structure)
* [Environment Variables](#environment-variables)
* [Scripts](#scripts)
* [Docker](#docker)
* [Testing](#testing)
* [Logging](#logging)
* [API Documentation](#api-documentation)
* [Contributing](#contributing)
* [License](#license)

---

## Features

* **Express + TypeScript** for scalable, type-safe APIs
* **MongoDB** integration for persistent data storage
* **JWT Authentication** for secure user access control
* **Multi-level comment system** with support for creating posts, comments, and replies
* Centralized **error handling** and **logging** with Winston
* Request **rate limiting** middleware
* Request **context** to track request IDs for better traceability
* **Swagger API documentation** for easy API exploration
* **Dockerized** for easy containerized deployments
* **Jest** for unit and integration testing
* Prettier for code formatting

---

## Getting Started

### Prerequisites

* Node.js >= 18.x
* npm
* Docker (optional, for containerization)

### Install dependencies

```bash
npm install
```

### Running the App

```bash
npm run dev
```

This will start the app in development mode using `ts-node-dev`.

---

## Project Structure

The project follows a modular structure for easier maintenance and scalability:

```
src/
├── config/            # Configuration files for MongoDB, JWT, etc.
├── controllers/       # API controllers to handle requests
├── errors/            # Centralized error handling
├── interfaces/        # TypeScript interfaces for data structures
├── middleware/        # Custom middleware (authentication, rate limiting)
├── models/            # Mongoose models for MongoDB
├── routes/            # API routes
├── swagger/           # Swagger API documentation
├── tests/             # Unit and integration tests
└── utils/             # Utility functions (e.g., logging)
```

---

## Environment Variables

Create a `.env` file in the root directory to configure your environment-specific settings. Below are the common variables used in this project:

```env
PORT=5000
LOG_LEVEL=development
NODE_ENV=development
MONGO_URI=YOUR_MONGO_URI
REDIS_CLIENT_URL=YOUR_REDIS_CLIENT_URL
DB_RETRY_COUNT=5
DB_RETRY_DELAY_MS=3000
JWT_SECRET_KEY=YOUR_SECRET_KEY
API_RATE_LIMIT_WINDOW_MINUTES=15
API_RATE_LIMIT_REQUESTS=50
LOGIN_RATE_LIMIT_WINDOW_MINUTES=10
LOGIN_RATE_LIMIT_REQUESTS=3
POST_COMMENT_RATE_LIMIT_WINDOW_MINUTES=5
POST_COMMENT_RATE_LIMTI_REQUESTS=1
REPLY_COMMENT_RATE_LIMIT_WINDOW_MINUTES=3
REPLY_COMMENT_RATE_LIMIT_REQUESTS=1
```

---

## NPM Scripts

The following scripts are available to help with development and deployment:

```json
"scripts": {
  "test": "jest --coverage",
  "go": "npm run build && npm start",
  "build": "tsc",
  "start": "node dist/index.js",
  "dev": "ts-node-dev src/index.ts"
}
```

---

## Swagger API Documentation

This API includes Swagger-based documentation to help you explore and interact with the available endpoints.

### Access Swagger UI:

Once the app is running, open your browser and go to:

```
http://localhost:5000/api-docs
```

This will show the Swagger UI, where you can view and interact with the API documentation.

---

## API Documentation

### Root Endpoint

**GET /home**
Fetch the architecture document of this project in markdown or HTML format.

### Auth Endpoints

* **POST /register**: User registration and JWT token generation
* **POST /login**: User login to receive JWT token

### Comment System Endpoints

* **POST /api/posts**: Create a new post
* **POST /api/posts/{postId}/comments**: Create a new comment on a post
* **POST /api/posts/{postId}/comments/{commentId}/reply**: Reply to an existing comment
* **GET /api/posts/{postId}/comments**: Retrieve all comments for a post with pagination and sorting
* **GET /api/posts/{postId}/comments/{commentId}/expand**: Expand top-level comments with pagination
* **GET /api-docs**: Get Swagger API documentation

For detailed endpoint descriptions and request/response formats, visit the `/api-docs` route.

---

## Logging

* Logs are managed using **Winston** and stored in the `logs/` directory at the project root.
* Supports daily log rotation with separate files for combined logs, errors, and HTTP requests.
* Log level is configurable via the `LOG_LEVEL` environment variable, with defaults set to `debug` in development and `info` in production.
* Each log entry includes a request ID (if available) for traceability across requests.

---

## Testing

This project uses **Jest** for unit and integration tests. All tests are located under the `src/tests` directory.

### Running Tests

Run all tests with coverage:

```bash
npm test
```

---

## Docker

### Local Setup with Docker

1. **Install Docker and Docker Compose**

    * Download and install Docker Desktop from [here](https://www.docker.com/get-started).
    * Docker Compose comes bundled with Docker Desktop.

2. **Run MongoDB and the App Together**

    * Use the provided `docker-compose.yml` file (ensure your app’s MongoDB URI points to `mongodb://mongo:27017/your-db-name`).
    * Run the following command to start both MongoDB and your app containers:

      ```bash
      docker-compose up
      ```

3. **Access the Application**

    * Open your browser and go to `http://localhost:3000` to access the application.

4. **Stop and Remove Containers**

    * To stop and remove the containers, run:

      ```bash
      docker-compose down
      ```

---

## Contributing

Feel free to open issues or pull requests to improve this or add features.

---

## License

This project is licensed under the **GPL License** — see the [LICENSE](LICENSE) file for details.

---