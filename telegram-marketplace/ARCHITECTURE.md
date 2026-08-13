# Architecture Documentation

## System Overview

The Telegram Marketplace is a full-stack, real-time web application that combines Telegram's messaging features with an eBay-style marketplace for buying and selling items.

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser / Client                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Next.js React Application (Frontend)                 │  │
│  │  - Pages: Login, Signup, Dashboard                     │  │
│  │  - Components: Chat, Deals, Sidebar                    │  │
│  │  - State: Zustand stores                               │  │
│  └───────────────────────────────────────────────────────┘  │
└────────────┬──────────────────────────────────────────────────┘
             │ HTTP + WebSocket
             ↓
┌─────────────────────────────────────────────────────────────┐
│            Network (Internet / Local Network)                │
│                                                              │
│  ┌──────────────────┐              ┌─────────────────────┐  │
│  │  REST API        │              │  Socket.io          │  │
│  │  (HTTP)          │              │  (WebSocket)        │  │
│  │  - Authentication│              │  - Real-time msgs   │  │
│  │  - CRUD ops      │              │  - Typing status    │  │
│  │  - Search        │              │  - Online presence  │  │
│  └──────────────────┘              └─────────────────────┘  │
└────────────┬─────────────────────────────────┬────────────────┘
             │                                 │
             ↓                                 ↓
┌─────────────────────────────────────────────────────────────┐
│        Express.js Backend Server (Node.js)                   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  API Routes                                          │   │
│  │  - /api/auth          (register, login)             │   │
│  │  - /api/users         (search, profile, contacts)   │   │
│  │  - /api/messages      (send, get, read)             │   │
│  │  - /api/groups        (CRUD, members)               │   │
│  │  - /api/deals         (marketplace, listings)       │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Middleware                                          │   │
│  │  - Authentication (JWT)                             │   │
│  │  - Error handling                                    │   │
│  │  - CORS                                              │   │
│  │  - Rate limiting                                     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Socket.io Server                                    │   │
│  │  - Connection management                             │   │
│  │  - Message broadcasting                              │   │
│  │  - Presence tracking                                 │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────┬──────────────────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────────────────┐
│           PostgreSQL Database                                │
│                                                              │
│  Tables:                                                    │
│  - users             (user accounts)                        │
│  - contacts          (user's contact list)                  │
│  - messages          (private messages)                     │
│  - groups            (group chats)                          │
│  - group_members     (group membership)                     │
│  - group_messages    (group messages)                       │
│  - deals             (marketplace listings)                 │
│  - deal_inquiries    (deal inquiries)                       │
│  - sessions          (active user sessions)                 │
│                                                              │
│  Indexes: ✓ On frequently queried columns                  │
│  Backups: ✓ Regular automated backups                      │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow Diagrams

### User Registration Flow

```
User Input
    ↓
[Frontend: Signup Page]
    ↓
POST /api/auth/register
    ↓
[Backend: authController.register()]
    ├─ Validate input
    ├─ Hash password with bcrypt
    ├─ Insert into users table
    └─ Generate JWT token
    ↓
Response: { user, token }
    ↓
[Frontend: Store in Zustand + localStorage]
    ↓
Redirect to Dashboard
```

### Real-time Messaging Flow

```
User A types message
    ↓
[Frontend: Message Input]
    ↓
Dual Path:
├─ POST /api/messages (persist to DB)
└─ emit('send-message', data) via Socket.io
    ↓
[Backend: Receives both]
├─ Save to messages table
└─ broadcast to User B via Socket
    ↓
User B receives via Socket
    ↓
[Frontend: Message appears instantly]
    ↓
emit('message-read') when viewed
    ↓
Database updated
```

### Marketplace Deal Flow

```
User A posts deal
    ↓
[Frontend: Create Deal Modal]
    ↓
POST /api/deals
    ↓
[Backend: dealController.createDeal()]
├─ Validate input
├─ Insert into deals table
└─ Return deal with ID
    ↓
[Frontend: Update deals list]
    ↓
User B views marketplace
    ↓
GET /api/deals (with filters)
    ↓
[Backend: Query deals + user info]
    ↓
Display deals list
    ↓
User B clicks "Message Seller"
    ↓
POST /api/deals/:dealId/inquire
└─ emit('send-message') to User A
    ↓
User A receives inquiry + direct message
```

## 🔐 Security Architecture

```
┌─────────────────────────────────────────┐
│  Frontend Security                      │
├─────────────────────────────────────────┤
│ • Secure token storage (localStorage)   │
│ • Input validation before API calls      │
│ • XSS protection via React escaping      │
│ • HTTPS in production                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Backend Security                       │
├─────────────────────────────────────────┤
│ • JWT token verification                │
│ • Password hashing (bcrypt)              │
│ • Input sanitization                     │
│ • Rate limiting                          │
│ • CORS configuration                     │
│ • Helmet.js security headers             │
│ • SQL parameterized queries              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  Database Security                      │
├─────────────────────────────────────────┤
│ • User access control                    │
│ • Password hashing stored                │
│ • Connection pooling                     │
│ • Automated backups                      │
└─────────────────────────────────────────┘
```

## 🔄 Authentication & Authorization

### JWT Token Flow

```
1. User Login/Register
   └─ POST /api/auth/login
   
2. Backend generates JWT with:
   {
     "id": user_id,
     "username": username,
     "iat": issued_at,
     "exp": expires_at (7 days)
   }
   
3. Token sent to Frontend
   └─ Stored in localStorage
   
4. Subsequent Requests
   └─ Authorization: Bearer <token>
   
5. Backend Middleware
   └─ Verify JWT signature
   └─ Check expiration
   └─ Extract user ID from payload
   
6. Route Handler
   └─ req.userId available
   └─ Perform action as authenticated user
```

### Access Control

```
Public Routes:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/deals
- GET /api/deals/:id
- GET /api/users/search
- GET /api/users/profile

Protected Routes (require valid JWT):
- GET /api/messages/:userId
- POST /api/messages
- PATCH /api/messages/:id/read
- GET /api/users/contacts
- POST /api/users/contacts/:id
- PATCH /api/users/profile
- POST /api/deals
- PATCH /api/deals/:id
- GET /api/deals/:id/inquiries

Ownership-based:
- Only deal creator can update/delete
- Only message participants can view
- Only group members can see messages
```

## 🔗 API Endpoint Architecture

### RESTful Design

```
RESOURCE        METHOD    ENDPOINT                  PURPOSE
─────────────────────────────────────────────────────────────
Auth            POST      /api/auth/register        Create account
Auth            POST      /api/auth/login           Authenticate

Users           GET       /api/users/profile/:id    Get profile
Users           GET       /api/users/search/:q      Search users
Users           PATCH     /api/users/profile        Update profile

Contacts        GET       /api/users/contacts       List contacts
Contacts        POST      /api/users/contacts/:id   Add contact

Messages        GET       /api/messages/:userId     Get conversation
Messages        POST      /api/messages             Send message
Messages        PATCH     /api/messages/:id/read    Mark as read

Groups          GET       /api/groups               Get user's groups
Groups          POST      /api/groups               Create group
Groups          GET       /api/groups/:id/messages  Get messages

Deals           GET       /api/deals                List deals
Deals           POST      /api/deals                Create deal
Deals           GET       /api/deals/:id            Get deal
Deals           PATCH     /api/deals/:id            Update deal
Deals           POST      /api/deals/:id/inquire    Send inquiry
Deals           GET       /api/deals/:id/inquiries  Get inquiries
```

## 📡 WebSocket (Socket.io) Events

### Client → Server (emit)

```
user-join              Notify server user is online
send-message           Send private message
send-group-message     Send group message
typing                 Broadcast typing indicator
message-read           Notify message was read
```

### Server → Client (on)

```
user-online            User came online
user-offline           User went offline
receive-message        New private message
receive-group-message  New group message
user-typing            User is typing
message-status         Message read status
```

## 🗄️ Database Schema Relationships

```
users (id) ─────────────────────────────────────┐
   ├─ 1:M → messages (sender_id/receiver_id)   │
   ├─ 1:M → contacts (user_id)                 │
   ├─ 1:M → groups (creator_id)                │
   ├─ M:M → group_members                      │
   ├─ 1:M → group_messages (sender_id)         │
   ├─ 1:M → deals (user_id)                    │
   ├─ 1:M → deal_inquiries (inquirer_id)       │
   └─ 1:1 → sessions (user_id)                 │

contacts
   ├─ user_id → users
   └─ contact_user_id → users

messages
   ├─ sender_id → users
   └─ receiver_id → users

groups (id)
   ├─ creator_id → users
   └─ 1:M → group_members

group_members
   ├─ group_id → groups
   └─ user_id → users

group_messages
   ├─ group_id → groups
   └─ sender_id → users

deals (id)
   ├─ user_id → users
   └─ 1:M → deal_inquiries

deal_inquiries
   ├─ deal_id → deals
   └─ inquirer_id → users

sessions
   └─ user_id → users
```

## 🚀 Deployment Architecture

### Development
```
localhost:3000 (Frontend)
     ↓ HTTP/WS
localhost:5000 (Backend)
     ↓
localhost:5432 (PostgreSQL)
```

### Production
```
Frontend              Backend              Database
Vercel/Netlify ─ HTTPS ─→ Heroku/Railway ─ TCP ─→ Cloud PostgreSQL
(CDN)                 (Auto-scale)        (Replicated)
```

## 📈 Performance Considerations

### Caching Strategy
```
Frontend:
- User profiles cached in component state
- Deals cached with timestamp (1 min TTL)
- Messages cached per conversation

Backend:
- Database connection pooling
- Query result caching (Redis - optional)
- Indexed columns for quick lookups
```

### Optimization Techniques

| Layer | Technique | Benefit |
|-------|-----------|---------|
| Frontend | Code splitting | Faster load times |
| Frontend | Image optimization | Reduced bandwidth |
| Backend | Connection pooling | Better resource usage |
| Backend | Pagination | Lower memory usage |
| Database | Indexing | Faster queries |
| Database | Partitioning | Scalability |

## 🔄 Scaling Strategy

### Horizontal Scaling (Add more servers)
```
Load Balancer
    ├─ Backend Instance 1
    ├─ Backend Instance 2
    ├─ Backend Instance 3
    └─ All connected to shared PostgreSQL
```

### Vertical Scaling (Upgrade server)
- Increase CPU/RAM
- Optimize queries
- Add caching layers

### Database Scaling
- Read replicas for queries
- Write primary for updates
- Connection pooling (PgBouncer)
- Sharding by user ID (if needed)

## 🔍 Monitoring & Observability

```
Application Logs
├─ Backend errors
├─ API response times
└─ Socket.io events

Database Monitoring
├─ Query performance
├─ Connection count
└─ Storage usage

Frontend Monitoring
├─ JavaScript errors
├─ API latency
└─ User interactions
```

## 🛡️ Disaster Recovery

```
Backup Strategy:
├─ Daily database backups
├─ Code versioning (Git)
└─ Environment configuration versioning

Recovery Process:
├─ Restore from latest backup
├─ Verify data integrity
└─ Failover to secondary instance
```

## 📋 Technology Stack Summary

```
Frontend:
├─ Next.js 14 (React framework)
├─ TypeScript (Type safety)
├─ Tailwind CSS (Styling)
├─ Socket.io Client (Real-time)
├─ Axios (HTTP client)
└─ Zustand (State management)

Backend:
├─ Node.js (Runtime)
├─ Express.js (Framework)
├─ Socket.io (Real-time server)
├─ PostgreSQL (Database)
├─ JWT (Authentication)
└─ Bcrypt (Password security)

DevOps:
├─ Docker (Containerization)
├─ Git (Version control)
├─ Vercel/Netlify (Frontend hosting)
├─ Heroku/Railway (Backend hosting)
└─ GitHub Actions (CI/CD)
```

---

This architecture supports:
✅ Real-time messaging
✅ Scalable marketplace
✅ Secure authentication
✅ High availability
✅ Disaster recovery
✅ Performance monitoring
