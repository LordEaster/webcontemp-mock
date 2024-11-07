# Backend API Documentation

This document provides an overview of the API endpoints for the backend application. The backend is built with Node.js, Express, and PostgreSQL, and it uses JWT for authentication. The application allows users to register, log in, and manage items in their personal bags.

---

## Table of Contents

- [Backend API Documentation](#backend-api-documentation)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Running the Application](#running-the-application)
  - [Authentication](#authentication)
    - [Register](#register)
    - [Login](#login)
  - [Users](#users)
    - [Get All Users](#get-all-users)
  - [Items](#items)
    - [Add Item to User's Bag](#add-item-to-users-bag)
    - [Get Items in User's Bag](#get-items-in-users-bag)
    - [Update Item in User's Bag](#update-item-in-users-bag)
    - [Delete Item from User's Bag](#delete-item-from-users-bag)
  - [Error Handling](#error-handling)
  - [Security Considerations](#security-considerations)
  - [Notes](#notes)

---

## Getting Started

### Prerequisites

- **Docker** and **Docker Compose** installed on your machine.
- **Node.js** and **npm** (optional, if you want to run the application without Docker).

### Running the Application

1. **Clone the Repository**

   ```bash
   git clone https://github.com/Lordeaster/webcontemp-mock.git
   cd backend
   ```

2. **Place `init.sql` in the Root Directory**

   Ensure that `init.sql` is in the same directory as `docker-compose.yml`.

3. **Build and Run the Containers**

   ```bash
   docker-compose up --build
   ```

   This command will build the Docker images and start the containers for the backend and PostgreSQL database.

4. **Access the Application**

   The backend API will be accessible at `http://localhost:3202`.

---

## Authentication

### Register

**Endpoint**

```
POST /register
```

**Description**

Register a new user.

**Request Body**

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response**

- **201 Created**

  ```json
  {
    "message": "User registered successfully"
  }
  ```

- **400 Bad Request**

  ```json
  {
    "error": "Email already registered"
  }
  ```

**Example**

```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"name":"Alice", "email":"alice@example.com", "password":"password123"}' \
http://localhost:3202/register
```

### Login

**Endpoint**

```
POST /login
```

**Description**

Authenticate a user and receive a JWT token.

**Request Body**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response**

- **200 OK**

  ```json
  {
    "token": "your_jwt_token"
  }
  ```

- **400 Bad Request**

  ```json
  {
    "error": "Invalid email or password"
  }
  ```

**Example**

```bash
curl -X POST -H "Content-Type: application/json" \
-d '{"email":"alice@example.com", "password":"password123"}' \
http://localhost:3202/login
```

---

## Users

### Get All Users

**Endpoint**

```
GET /users
```

**Description**

Retrieve a list of all users. **Authentication required.**

**Headers**

- `Authorization: Bearer your_jwt_token`

**Response**

- **200 OK**

  ```json
  [
    {
      "id": 1,
      "name": "Alice",
      "email": "alice@example.com"
    },
    {
      "id": 2,
      "name": "Bob",
      "email": "bob@example.com"
    }
  ]
  ```

- **401 Unauthorized**

  ```json
  {
    "error": "Access token required"
  }
  ```

- **403 Forbidden**

  ```json
  {
    "error": "Invalid or expired token"
  }
  ```

**Example**

```bash
curl -H "Authorization: Bearer your_jwt_token" \
http://localhost:3202/users
```

---

## Items

### Add Item to User's Bag

**Endpoint**

```
POST /users/:userId/items
```

**Description**

Add a new item to the authenticated user's bag. **Authentication required.**

**Headers**

- `Authorization: Bearer your_jwt_token`

**Path Parameters**

- `userId`: The ID of the user (must match the authenticated user's ID).

**Request Body**

```json
{
  "item_name": "string",
  "quantity": "integer (optional, default is 1)"
}
```

**Response**

- **201 Created**

  ```json
  {
    "id": 1,
    "user_id": 1,
    "item_name": "Sword",
    "quantity": 1
  }
  ```

- **403 Forbidden**

  ```json
  {
    "error": "Forbidden"
  }
  ```

**Example**

```bash
curl -X POST -H "Content-Type: application/json" \
-H "Authorization: Bearer your_jwt_token" \
-d '{"item_name": "Sword", "quantity": 1}' \
http://localhost:3202/users/1/items
```

### Get Items in User's Bag

**Endpoint**

```
GET /users/:userId/items
```

**Description**

Retrieve all items in the authenticated user's bag. **Authentication required.**

**Headers**

- `Authorization: Bearer your_jwt_token`

**Path Parameters**

- `userId`: The ID of the user (must match the authenticated user's ID).

**Response**

- **200 OK**

  ```json
  [
    {
      "id": 1,
      "user_id": 1,
      "item_name": "Sword",
      "quantity": 1
    },
    {
      "id": 2,
      "user_id": 1,
      "item_name": "Shield",
      "quantity": 1
    }
  ]
  ```

- **403 Forbidden**

  ```json
  {
    "error": "Forbidden"
  }
  ```

**Example**

```bash
curl -H "Authorization: Bearer your_jwt_token" \
http://localhost:3202/users/1/items
```

### Update Item in User's Bag

**Endpoint**

```
PUT /items/:id
```

**Description**

Update an item in the authenticated user's bag. **Authentication required.**

**Headers**

- `Authorization: Bearer your_jwt_token`

**Path Parameters**

- `id`: The ID of the item to update.

**Request Body**

```json
{
  "item_name": "string (optional)",
  "quantity": "integer (optional)"
}
```

**Response**

- **200 OK**

  ```json
  {
    "id": 1,
    "user_id": 1,
    "item_name": "Enchanted Sword",
    "quantity": 2
  }
  ```

- **403 Forbidden**

  ```json
  {
    "error": "Forbidden"
  }
  ```

- **404 Not Found**

  ```json
  {
    "error": "Item not found"
  }
  ```

**Example**

```bash
curl -X PUT -H "Content-Type: application/json" \
-H "Authorization: Bearer your_jwt_token" \
-d '{"item_name": "Enchanted Sword", "quantity": 2}' \
http://localhost:3202/items/1
```

### Delete Item from User's Bag

**Endpoint**

```
DELETE /items/:id
```

**Description**

Delete an item from the authenticated user's bag. **Authentication required.**

**Headers**

- `Authorization: Bearer your_jwt_token`

**Path Parameters**

- `id`: The ID of the item to delete.

**Response**

- **204 No Content**

  No response body.

- **403 Forbidden**

  ```json
  {
    "error": "Forbidden"
  }
  ```

- **404 Not Found**

  ```json
  {
    "error": "Item not found"
  }
  ```

**Example**

```bash
curl -X DELETE -H "Authorization: Bearer your_jwt_token" \
http://localhost:3202/items/1
```

---

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of an API request. Errors contain a JSON response body with an `error` message.

**Common Error Responses**

- **400 Bad Request**

  ```json
  {
    "error": "Description of the client-side error."
  }
  ```

- **401 Unauthorized**

  ```json
  {
    "error": "Access token required"
  }
  ```

- **403 Forbidden**

  ```json
  {
    "error": "Invalid or expired token"
  }
  ```

- **404 Not Found**

  ```json
  {
    "error": "Resource not found"
  }
  ```

- **500 Internal Server Error**

  ```json
  {
    "error": "Description of the server-side error."
  }
  ```

---

## Security Considerations

- **Authentication**

  - The API uses JWT (JSON Web Tokens) for authentication.
  - Tokens should be included in the `Authorization` header as `Bearer your_jwt_token`.

- **Password Storage**

  - Passwords are hashed using `bcrypt` before being stored in the database.

- **Data Validation**

  - Input validation is minimal; it's recommended to add proper validation in production environments.

- **HTTPS**

  - For production deployments, ensure the API is served over HTTPS to encrypt data in transit.

- **Environment Variables**

  - Sensitive information like `JWT_SECRET` should be stored securely and not hard-coded.

---

## Notes

- **Data Persistence**

  - The PostgreSQL database is initialized with `init.sql` during the first run.
  - Data is stored in a Docker volume named `db_data`.

- **Development Workflow**

  - The application is written in TypeScript and compiled to JavaScript before running.
  - For development, you can use `nodemon` and `ts-node` for hot reloading.