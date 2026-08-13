# Quick Start Guide

Get the Telegram Marketplace running in minutes!

## 1️⃣ Clone/Extract Project

Your project is already at: `c:\Users\USER\Contacts\mhembere\telegram-marketplace`

## 2️⃣ Install Dependencies

### Backend
```bash
cd telegram-marketplace/backend
npm install
```

### Frontend
```bash
cd telegram-marketplace/frontend
npm install
```

## 3️⃣ Database Setup

### Create PostgreSQL Database
```bash
# Connect to PostgreSQL (default user: postgres)
psql -U postgres

# Create database
CREATE DATABASE telegram_marketplace;

# Exit
\q

# Initialize schema
psql -U postgres -d telegram_marketplace -f database/schema.sql
```

**Alternative: Use PostgreSQL GUI**
- pgAdmin 4 (https://www.pgadmin.org/)
- Use "SQL Query" to run schema.sql

## 4️⃣ Configure Environment

### Backend (.env)
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=telegram_marketplace
JWT_SECRET=your-super-secret-key
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend (.env.local)
```bash
cd ../frontend
cp .env.example .env.local
```

No changes needed - defaults work for local development!

## 5️⃣ Start Services

### Terminal 1: Backend
```bash
cd backend
npm run dev
```
✅ Server running on http://localhost:5000

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```
✅ App running on http://localhost:3000

## 6️⃣ Test the App

1. **Open** http://localhost:3000
2. **Sign Up** with a new account
3. **Open** another browser window (Incognito mode)
4. **Sign Up** with a different account
5. **Add Contact**: User A searches for User B and adds as contact
6. **Send Message**: Click on User B and send a message
7. **Create Deal**: Click marketplace, create a deal
8. **Message Seller**: Switch to User B, click "Message Seller" on deal

## 📁 Project Structure at a Glance

```
telegram-marketplace/
├── backend/              # Node.js server
│   ├── src/
│   ├── package.json
│   └── .env.example
├── frontend/             # Next.js app
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── .env.example
├── database/
│   └── schema.sql       # PostgreSQL schema
├── README.md            # Project overview
└── DEPLOYMENT.md        # Deploy to production
```

## 🎯 Key Features to Try

### Messaging
- Search for users
- Add to contacts
- Send real-time messages
- See online/offline status

### Marketplace
- Filter deals by category
- Search for items
- Create new deals
- Message sellers directly

## 🔧 Common Commands

```bash
# Start development
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## ✅ Verification Checklist

- [ ] Database created and schema loaded
- [ ] Backend starts without errors
- [ ] Frontend loads at localhost:3000
- [ ] Can create account
- [ ] Can log in
- [ ] Can search for users
- [ ] Can send messages in real-time
- [ ] Can create deals
- [ ] Can message sellers

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 5000 already in use | Kill process or change PORT in .env |
| Database connection fails | Check credentials in .env, verify PostgreSQL running |
| Frontend can't reach backend | Check NEXT_PUBLIC_API_URL in .env.local |
| Messages not appearing | Check browser console, verify Socket.io connected |

## 📖 Full Documentation

- **Backend**: See `backend/README.md`
- **Frontend**: See `frontend/README.md`
- **Deployment**: See `DEPLOYMENT.md`

## 🚀 Next Steps

1. **Customize**: Modify colors, text in components
2. **Add Features**: Implement groups, file sharing, etc.
3. **Deploy**: Follow DEPLOYMENT.md for production
4. **Scale**: Add caching, optimize database queries

## 💡 Tips

- Use VS Code for best development experience
- Install "REST Client" extension to test API
- Open DevTools (F12) to see real-time socket events
- Check `.env.example` files for all available options

## 📞 Need Help?

- Check README.md in backend/ or frontend/
- Review API responses in browser Network tab
- Check terminal output for errors
- Read inline code comments

---

**Congratulations! 🎉 Your Telegram Marketplace is ready to use!**
