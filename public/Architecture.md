 📐 **ARCHITECTURE**
==================

 🧩 **Project Overview**
-----------------------

This is a **multi-level comment system API** backend built with Node.js, TypeScript, Express, and MongoDB. It allows users to create comments, reply to existing comments, and retrieve comments with pagination. The system includes JWT-based authentication, rate-limiting, and supports the hierarchical structure of comments. The application is containerized using Docker and configured via environment variables.

---

 🛠 **Tech Stack**
-----------------

| Component | Technology |
| --- | --- |
| Language | TypeScript (Node.js) |
| Framework | Express |
| Database | MongoDB |
| Authentication | JWT |
| Containerization | Docker + Docker Compose |
| Rate Limiting | Express-rate-limit |
| Pagination | MongoDB with aggregation |
| Testing | Jest |
| API Documentation | Swagger (OpenAPI) |

---

 🧱 **Folder Structure**
----------------------

### 📂 Folder Descriptions

- **app.ts**: The main file where the Express app is set up.
- **config/**: Contains files for environment variables and configurations related to the database, JWT, rate-limiting, and other integrations.
- **controllers/**: Handles the logic for various API endpoints, including user authentication and comment management.
- **errors/**: Centralized error handling classes, used for standardizing error responses and error messages.
- **app.ts**: Contains Express-specific logic, such as the app configuration, middleware setup, and routes.
- **index.ts**: Entry point to the app, where the server is initialized and started.
- **interfaces/**: Contains TypeScript interfaces, which define the structure of the data used in various parts of the application.
- **middleware/**: Houses authentication, validation, rate-limiting, and error handling middleware.
- **models/**: Mongoose schema definitions for users, posts, comments, etc.
- **routes/**: Contains Express route definitions that are used to map URL paths to controller functions.
- **swagger/**: Setup files for Swagger/OpenAPI documentation for the API.
- **tests/**: Contains Jest test cases for various parts of the application, focusing on unit testing controllers and business logic.
- **utils/**: A collection of utility functions, such as data sanitization or common helper methods used across the project.

---

 🔐 **Authentication**
-------------------

- **JWT** is used for stateless user authentication.
- Tokens are verified for both REST requests.
- Middleware ensures that unauthorized users are blocked from protected routes.

---

 🌐 **RESTful APIs**
------------------

### Root

* **GET [/home](/)** : Get an architecture document of this project as .md or html.

### Auth

* **POST /register**: User registration and receive JWT.
* **POST /login**: Login and receive JWT.

### Comments System (Multi-Level Comments)

#### 1. Create Post
* **POST /api/posts/**: Create a new post.
  - **Request Body**:
      - `title`: The title of the post.
      - `content`: The text content of the post.
      - `userId`: The ID of the authenticated user who is making the comment.    - 

#### 2. Create Comment

* **POST /api/posts/{postId}/comments**: Create a new comment on a post.
    - **Request Body**:
        - `postId`: The ID of the post to which the comment is being added.
        - `text`: The text content of the comment.
    - **Rate Limiting**: Limits the number of comments a user can create within a specified time frame.

#### 3. Reply to Existing Comment

* **POST /api/posts/{postId}/comments/{commentId}/reply**: Reply to an existing comment on a post.
    - **Request Body**:
        - `postId`: The ID of the post.
        - `commentId`: The ID of the comment being replied to.
        - `text`: The text content of the reply.
    - **Rate Limiting**: Rate limit applied to replies.

#### 4. Get Comments for a Post

* **GET /api/posts/{postId}/comments**: Retrieve comments for a specific post.
    - **Request Parameters**:
        - `postId`: The ID of the post for which comments are being retrieved.
        - `sortBy`: The field by which to sort comments (e.g., createdAt, repliesCount).
        - `sortOrder`: The sorting order (`asc` or `desc`).
    - **Response**: An array of comments, each containing:
        - `id`: The ID of the comment.
        - `text`: The content of the comment.
        - `createdAt`: Timestamp of comment creation.
        - `replies`: The two most recent replies, with each containing:
            - `id`: The ID of the reply.
            - `text`: The content of the reply.
            - `createdAt`: Timestamp of reply creation.

#### 5. Expand Parent-Level Comments (Pagination)

* **GET /api/posts/{postId}/comments/{commentId}/expand**: Expand top-level comments for a post with pagination.
    - **Request Parameters**:
        - `postId`: The ID of the post for which comments are being expanded.
        - `commentId`: The ID of the top-level comment being expanded.
        - `page`: Page number.
        - `pageSize`: Number of comments per page.
    - **Response**: Paginated array of comments, with replies.

#### 5. Swagger Doc

* **GET [/api-docs](/api-docs)** : Get Swagger API Documentation.

---

 🗄 **Database Models**
------------------

### 📚 Models Documentation

This document provides an overview of the Mongoose models used in the project.

#### 🧑‍🤝‍🧑 **User Registration Model**

**Structure**:

- `username`: A unique string identifier for the user.
- `email`: The user's email address (must be unique).
- `password`: The user's password, validated for complexity (e.g., length, uppercase/lowercase, numeric, and special characters).
- `createdAt`: Timestamp for when the user account was created.
- `updatedAt`: Timestamp for when the user data was last updated.

**Purpose**: This model handles the user registration process. It ensures that each user has a unique username and email, and that the password adheres to complexity rules.

---

#### 💬 **Post Model**

**Structure**:

- `postId`: A unique identifier for the post (auto-incremented by `mongoose-sequence`).
- `userId`: The ID of the user who created the post (required, references the `User` model).
- `title`: The title of the post (required, trimmed, min length 3 characters, max length 50 characters).
- `content`: The main content of the post (required, trimmed, min length 1 character, max length 150 characters).
- `createdAt`: Timestamp for when the post was created.
- `updatedAt`: Timestamp for when the post was last updated.

**Purpose**: This model defines and stores information related to posts. It ensures that each post has a unique `postId`, a `userId` associated with the user who created the post, and a `title` and `content`.

**Auto-Incrementing `postId`**:
- The `postId` is auto-incremented using the `mongoose-sequence` plugin, ensuring each post has a unique identifier.
- This allows efficient querying and management of posts.

**Indexes**:
- `postId`: Ensures uniqueness and efficient querying for the post identifier.
- `userId`: Helps retrieve all posts created by a specific user.
- `createdAt`: Used for efficient sorting and querying of posts by creation date.

#### 💬 Comment Model

**Structure**:

- `postId`: ID of the post the comment belongs to.
- `userId`: The ID of the user who created the comment.
- `text`: Content of the comment.
- `createdAt`: Timestamp for when the comment was created.
- `updatedAt`: Timestamp for when the comment was last updated.
- `parentCommentId`: ID of the parent comment if this is a reply.

**Purpose**: This model stores comments made by users, whether direct comments or replies to existing comments.

#### 🔄 Indexes

- **Comment Indexes**:
    - `postId` for fast retrieval of comments for a specific post.
    - `parentCommentId` for querying replies quickly.

---

### 🔐 Security Considerations

- **User Registration**: Passwords should follow specified complexity rules.
- **Encryption**: All sensitive data, especially passwords, should be encrypted.

---

 ⚡ **Potential Improvements**

- **Comment Model**:
    - Add **media attachments** support to allow comments to contain images, videos, etc.
- **Scalability**: Add **sharding** to MongoDB to handle large volumes of posts and comments efficiently.

---
 📋 **Project Overview**
-----------------------

### ✅ Testing

Jest is used for unit testing layers. Integration tests ensure full api's functionality.
Test files are added in **/src/tests** change the **NODE_ENV=test** and run **npm run test** command to execute tests.

- **Focus Areas**:
    - **Comment Handling**: Test the creation, replying, and pagination of comments.
    - **Rate Limiting**: Ensure rate limits are enforced correctly for both comments and replies.

---

 📦 **Deployment**
-----------------

- **Dockerized** with a `Dockerfile` and `docker-compose.yml`.
- **Environment variables** managed via `.env`.
- Suitable for deployment on platforms like:
    - Railway
    - Render
    - AWS ECS

---

 📊 **Swagger Documentation**
---------------------------

API documentation is available at `/api-docs` for all endpoints, including the new comment-related ones.

---

 🚀 **Potential Improvements**
-----------------------------

| Area | Suggestions |
| --- | --- |
| Performance | Implement **caching** for frequently accessed posts and comments. |
| Scalability | Implement **sharding** and **horizontal scaling**. |
| Security | **brute force** protection for login and comment APIs. |
| Features | Add **media message support** in comments. |
| Testing | Add **integration tests** for the complete comment workflow. |

---

 📌 **Design Considerations**
----------------------------

- **Modular Structure**: Clear separation of concerns for maintainability.
- **Type Safety**: TypeScript ensures contracts are enforced across layers.
- **Docker-Ready**: Docker containerized for easy deployment.

---
