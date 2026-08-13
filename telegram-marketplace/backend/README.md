# Telegram Marketplace Backend

Real-time messaging server with marketplace functionality using Node.js, Express, and Socket.io.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 12+
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your configuration:
   - Database credentials
   - JWT secret
   - Port and frontend URL

3. **Set up PostgreSQL database**
   ```bash
   createdb telegram_marketplace
   psql -U postgres -d telegram_marketplace -f ../database/schema.sql
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:5000` by default.

## 📁 Project Structure

```
backend/src/
├── controllers/      # Business logic
│   └── authController.js
├── routes/          # API endpoints
│   ├── authRoutes.js
│   ├── messageRoutes.js
│   ├── groupRoutes.js
│   ├── userRoutes.js
│   └── dealRoutes.js
├── middleware/      # Authentication & validation
│   └── authMiddleware.js
├── utils/           # Helpers
│   └── database.js
└── server.js        # Main entry point
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Sign in

### Messages
- `GET /api/messages/:userId` - Get conversation history
- `POST /api/messages` - Send message
- `PATCH /api/messages/:messageId/read` - Mark as read

### Users
- `GET /api/users/profile/:userId` - Get user profile
- `GET /api/users/search/:query` - Search users
- `POST /api/users/contacts/:contactId` - Add contact
- `GET /api/users/contacts` - Get contact list
- `PATCH /api/users/profile` - Update profile

### Groups
- `POST /api/groups` - Create group
- `GET /api/groups` - Get user's groups
- `GET /api/groups/:groupId/messages` - Get group messages

### Deals (Marketplace)
- `GET /api/deals` - List all deals with filters
- `POST /api/deals` - Create new deal
- `GET /api/deals/:dealId` - Get deal details
- `PATCH /api/deals/:dealId` - Update deal status
- `POST /api/deals/:dealId/inquire` - Send inquiry
- `GET /api/deals/:dealId/inquiries` - Get inquiries

## 🔌 WebSocket Events

### Emit from Client
- `user-join` - User connects
- `send-message` - Send private message
- `send-group-message` - Send group message
- `typing` - User typing indicator
- `message-read` - Message read status

### Listen from Server
- `user-online` - User came online
- `user-offline` - User went offline
- `receive-message` - New private message
- `receive-group-message` - New group message
- `user-typing` - User is typing
- `message-status` - Message read status

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🗄️ Database Schema

See `../database/schema.sql` for complete database schema.

Key tables:
- `users` - User accounts
- `messages` - Private messages
- `groups` - Chat groups
- `group_members` - Group membership
- `group_messages` - Group chat messages
- `deals` - Marketplace listings
- `contacts` - User contact lists
- `sessions` - Active user sessions

## 📝 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run build` - Build for production

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `DB_USER` | PostgreSQL user | postgres |
| `DB_PASSWORD` | PostgreSQL password | |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | telegram_marketplace |
| `JWT_SECRET` | Secret for JWT signing | your-secret-key |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:3000 |
| `NODE_ENV` | Environment | development |

## 🔄 Real-time Features

### Message Delivery
- Messages are instantly delivered via WebSocket
- Fallback to API polling if connection is lost
- Persistent message history in database

### Typing Indicators
- Real-time feedback when users are typing
- Automatic timeout after 3 seconds of inactivity

### User Status
- Online/offline status tracking
- Last seen timestamp

### Automatic Reconnection
- Socket.io handles reconnection automatically
- Exponential backoff for failed connections

## 🐛 Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "Error description"
}
```

HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not found
- `409` - Conflict
- `500` - Server error

## 📦 Dependencies

- **express** - Web framework
- **socket.io** - Real-time communication
- **pg** - PostgreSQL client
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - CORS middleware
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **dotenv** - Environment variables

## 🚀 Deployment

### Heroku
```bash
heroku create telegram-marketplace-api
git push heroku main
```

### Railway
```bash
railway link
railway up
```

### Docker
```bash
docker build -t telegram-marketplace-backend .
docker run -p 5000:5000 telegram-marketplace-backend
```

## 📚 Further Documentation

- [Express.js Docs](https://expressjs.com/)
- [Socket.io Docs](https://socket.io/docs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [JWT Docs](https://jwt.io/)
