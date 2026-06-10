# 🔒 Arishti Secure Chat — Real-Time Chat Application

A production-grade, secure real-time chat room application built for the **Arishti CyberSecurity** Full Stack Developer Technical Task. Two users can connect and chat in real-time using WebSocket technology.

## ✨ Features

- **Real-time messaging** via Socket.io (WebSocket transport)
- **JWT-based authentication** — Secure token-based auth with expiration
- **Password security** — Bcrypt hashing with salt rounds of 12
- **MongoDB persistence** — All messages stored in MongoDB
- **Browser notifications** — Native WebSocket-based push notifications (no Firebase)
- **Read receipts** — Double-check marks for read messages
- **Typing indicators** — Real-time typing status
- **Online/offline status** — Live user presence tracking
- **Soft delete** — Messages can be deleted without hard removal
- **Redux Toolkit** — Centralized state management
- **Responsive dark-mode UI** — Works on Chrome & Firefox
- **Rate limiting** — 100 requests per 15 minutes per IP
- **Helmet** — HTTP security headers
- **Input validation** — Server-side regex validation for usernames & passwords

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19 (Vite), Redux Toolkit, React Router v7, Socket.io-client, Lucide Icons |
| **Backend** | Node.js, Express 5, Socket.io, Mongoose (MongoDB ODM) |
| **Database** | MongoDB |
| **Security** | JWT, Bcrypt, Helmet, express-rate-limit, CORS, Input Validation |
| **Dev Tools** | Nodemon, ESLint, Postman |

## 📁 Project Structure

```
chat-app/
├── client/                   # React Frontend (Vite)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── NotificationPanel.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── pages/            # Route-level pages
│   │   │   ├── ChatLayout.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── services/         # API & Socket services
│   │   │   ├── api.js
│   │   │   └── socketService.js
│   │   ├── store/            # Redux Toolkit slices
│   │   │   ├── store.js
│   │   │   ├── authSlice.js
│   │   │   ├── chatSlice.js
│   │   │   └── uiSlice.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   └── package.json
├── server/                   # Node.js Backend
│   ├── middleware/
│   │   └── auth.js           # JWT verification middleware
│   ├── models/
│   │   ├── User.js           # User schema with bcrypt hooks
│   │   └── Message.js        # Message schema with soft delete
│   ├── routes/
│   │   ├── auth.js           # Register, Login, Get Me
│   │   └── messages.js       # Get Messages, Delete Message
│   ├── socket/
│   │   └── socketManager.js  # Socket.io event handlers
│   ├── app.js                # Express app configuration
│   ├── server.js             # Server entry point
│   ├── .env
│   └── package.json
├── postman/
│   └── ChatApp.postman_collection.json
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** v16 or higher
- **MongoDB** running locally on `localhost:27017`
- **Git** for version control

### 1. Clone the Repository

```bash
git clone <repository-url>
cd chat-app
```

### 2. Backend Setup

```bash
cd server
npm install
npm run dev
```

The server will start on `http://localhost:5000`.

### 3. Frontend Setup

Open a **new terminal**:

```bash
cd client
npm install
npm run dev
```

The client will start on `http://localhost:5173`.

### 4. Test the Chat

1. Open `http://localhost:5173` in **Chrome**
2. Register a user (e.g., `testuser1` / `Password123!`)
3. Open `http://localhost:5173` in **Firefox** (or another Chrome tab/incognito)
4. Register a second user (e.g., `testuser2` / `Password123!`)
5. Start chatting! Messages appear in real-time with notifications.

## 📡 REST API Documentation

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user profile | Yes (Bearer Token) |

**Register/Login Body:**
```json
{
  "username": "testuser1",
  "password": "Password123!"
}
```

**Password Requirements:**
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*)

### Messages

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/messages?room=general&page=1&limit=30` | Get paginated messages | Yes |
| DELETE | `/api/messages/:id` | Soft-delete a message | Yes (owner only) |

## 🔌 WebSocket Events

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `message:send` | `{ content, room }` | Send a new message |
| `message:typing` | `{ isTyping, room }` | Typing indicator |
| `message:read` | `{ messageId, room }` | Mark message as read |

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `message:received` | Full message object | New message broadcast |
| `notification:new` | `{ from, preview, messageId, timestamp }` | Browser notification |
| `users:list` | Array of online users | Initial user list |
| `user:online` | `{ userId, username }` | User came online |
| `user:offline` | `{ userId, username }` | User went offline |
| `message:typing` | `{ userId, username, isTyping }` | Typing status |
| `message:deleted` | `{ messageId }` | Message was deleted |
| `message:read:update` | `{ messageId, readBy }` | Read receipt update |

## 🔐 Security Measures

1. **JWT Authentication** — Tokens sent via `Authorization: Bearer <token>` header
2. **Password Hashing** — Bcrypt with 12 salt rounds
3. **Rate Limiting** — 100 requests per 15 minutes per IP
4. **Input Validation** — Regex validation for usernames and passwords
5. **Data Sanitization** — Request body limited to 10KB via `express.json({ limit: '10kb' })`
6. **HTTP Security Headers** — Helmet middleware sets CSP, HSTS, X-Frame-Options, etc.
7. **CORS** — Restricted to the client origin only
8. **Socket Auth** — JWT verification middleware on every WebSocket connection
9. **Authorization** — Users can only delete their own messages
10. **Token Expiry** — JWTs expire after 7 days

## 🧪 Postman Collection

Import `postman/ChatApp.postman_collection.json` into Postman:

1. Open Postman → Import → Upload File
2. Select `ChatApp.postman_collection.json`
3. Create an environment with a `token` variable
4. Run "Login" first — the token is auto-saved via test script
5. Use other endpoints with the saved token

## 🌐 Browser Compatibility

- ✅ Google Chrome (latest)
- ✅ Mozilla Firefox (latest)
- ✅ Microsoft Edge (Chromium-based)

## 📝 Environment Variables

### Server (`server/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 5000 | Server port |
| `MONGO_URI` | `mongodb://localhost:27017/chatapp` | MongoDB connection string |
| `JWT_SECRET` | — | Secret key for JWT signing |
| `JWT_EXPIRES_IN` | `7d` | Token expiration duration |
| `CLIENT_URL` | `http://localhost:5173` | Allowed CORS origin |

### Client (`client/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:5000` | Backend server URL |

## Author

Built for Arishti CyberSecurity Technical Assessment
