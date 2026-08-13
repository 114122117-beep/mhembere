# Telegram Clone with Marketplace - Full Stack Application

A real-time messaging platform combining Telegram's messaging capabilities with a built-in marketplace for buying/selling items.

## 📋 Project Architecture

```
telegram-marketplace/
├── backend/              # Node.js/Express server
│   ├── src/
│   │   ├── models/       # Database models
│   │   ├── controllers/  # Business logic
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Authentication, validation
│   │   ├── utils/        # Helper functions
│   │   └── server.js     # Main server file
│   ├── package.json
│   └── .env.example
├── frontend/             # Next.js/React application
│   ├── app/              # App router pages
│   ├── components/       # Reusable components
│   ├── lib/              # Utilities and services
│   └── public/           # Static assets
├── database/
│   ├── schema.sql        # PostgreSQL schema
│   └── seed.sql          # Initial data
└── README.md
```

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Database Setup
```bash
# Install PostgreSQL
# Create database and run schema.sql
psql -U postgres -f database/schema.sql
```

## 🏗️ Tech Stack

- **Frontend:** Next.js 14, React, Tailwind CSS, TypeScript
- **Backend:** Node.js, Express.js, TypeScript
- **Real-time:** Socket.io
- **Database:** PostgreSQL
- **Authentication:** JWT
- **Deployment:** Vercel (Frontend), Heroku/Railway (Backend)

## 📚 Core Features

✅ User authentication & profile management
✅ 1-on-1 private messaging
✅ Group chat creation and management
✅ Real-time message delivery
✅ Persistent message history
✅ Deals marketplace with filters
✅ Global user search
✅ Direct messaging from deals

## 🔐 Security Features

- Password hashing with bcrypt
- JWT token authentication
- CORS protection
- Input validation & sanitization
- Rate limiting

## 📖 Documentation

See individual README files in each folder for detailed setup and usage instructions.
