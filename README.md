# Real-Time Chat App

A production-grade, secure real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io.

## Features

- Real-time messaging with Socket.io
- Secure JWT-based authentication
- Password hashing with bcrypt
- MongoDB persistence
- Read receipts and Typing indicators
- Online/offline status
- Soft delete for messages
- Redux Toolkit for state management
- Sleek dark-mode UI

## Tech Stack

- **Frontend**: React (Vite), Redux Toolkit, React Router, Socket.io-client, Lucide-react
- **Backend**: Node.js, Express, Socket.io, MongoDB (Mongoose), JWT
- **Security**: Helmet, express-rate-limit, cors, bcrypt

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB running locally on `localhost:27017`

### Backend Setup

1. Open a terminal and navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory (already created for you):
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/chatapp
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

### Accessing the App

Open your browser and navigate to `http://localhost:5173`. You can open it in two different tabs or browsers to test the real-time chat.

## API Documentation

### Auth

- `POST /api/auth/register`: Register a new user
  - Body: `{ "username": "test", "password": "Password123!" }`
- `POST /api/auth/login`: Login user
  - Body: `{ "username": "test", "password": "Password123!" }`
- `GET /api/auth/me`: Get current user (Requires Authorization header with Bearer token)

### Messages

- `GET /api/messages`: Get messages (Supports pagination via `page` and `limit` queries)
- `DELETE /api/messages/:id`: Soft delete a message

## Socket Events

### Emitted by Client

- `message:send`: `{ content, room }`
- `message:typing`: `{ isTyping, room }`
- `message:read`: `{ messageId, room }`

### Listened by Client

- `message:received`: Payload contains full message object
- `notification:new`: Payload contains `from`, `preview`, `messageId`, `timestamp`
- `users:list`: List of online users on connect
- `user:online`: Broadcasted when a new user joins
- `user:offline`: Broadcasted when a user disconnects
- `message:typing`: Payload contains `userId`, `username`, `isTyping`
- `message:deleted`: Payload contains `messageId`
- `message:read:update`: Payload contains `messageId`, `readBy` array

## Security Measures

- **Authentication**: JWT sent via headers, password hashed via bcrypt.
- **Authorization**: Protected routes verify token validity. Users can only delete their own messages.
- **Rate Limiting**: 100 requests per 15 minutes per IP.
- **Data Sanitization**: Mongoose schema validation for limits. `express.json({ limit: '10kb' })`.
- **Headers**: Helmet sets various HTTP headers to secure the Express app.

## Postman Collection

Import `postman/ChatApp.postman_collection.json` into your Postman workspace to easily interact with the REST APIs. It automatically stores the authentication token in a `token` environment variable upon login.

## Author

Rohith
