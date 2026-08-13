# Setup and Deployment Guide

Complete guide for setting up and deploying the Telegram Marketplace application.

## 📋 Prerequisites

### System Requirements
- Node.js 18+ or higher
- PostgreSQL 12+ or higher
- Git
- npm or yarn (Node package manager)

### Accounts Needed (for deployment)
- GitHub (for version control)
- Vercel (for frontend) or similar hosting
- Heroku, Railway, or similar (for backend)
- PostgreSQL hosting (Heroku Postgres, Neon, etc.)

## 🗄️ Database Setup

### Local PostgreSQL Setup

1. **Install PostgreSQL**
   - Windows: Download from https://www.postgresql.org/download/windows/
   - macOS: `brew install postgresql`
   - Linux: `sudo apt-get install postgresql`

2. **Start PostgreSQL service**
   ```bash
   # macOS
   brew services start postgresql

   # Linux
   sudo systemctl start postgresql

   # Windows - should start automatically
   ```

3. **Create database**
   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE telegram_marketplace;

   # List databases
   \l

   # Exit
   \q
   ```

4. **Initialize schema**
   ```bash
   psql -U postgres -d telegram_marketplace -f database/schema.sql
   ```

5. **Verify setup**
   ```bash
   psql -U postgres -d telegram_marketplace -c "\dt"
   ```

### Cloud PostgreSQL Setup

#### Option 1: Heroku Postgres
```bash
# Create Heroku account and install CLI
heroku login

# Add PostgreSQL to app
heroku addons:create heroku-postgresql:hobby-dev
```

#### Option 2: Neon
1. Go to https://neon.tech/
2. Create account and project
3. Copy connection string
4. Use in `.env`

## 🚀 Backend Setup & Deployment

### Local Development

1. **Clone and setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```

2. **Configure .env**
   ```env
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=telegram_marketplace
   JWT_SECRET=your-very-secret-key-change-this
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

3. **Start server**
   ```bash
   npm run dev
   ```

4. **Verify running**
   - API: http://localhost:5000/api/auth/login (should return 400)
   - Socket.io: http://localhost:5000 (should connect)

### Production Deployment - Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Create Heroku app**
   ```bash
   heroku create telegram-marketplace-api
   ```

3. **Set environment variables**
   ```bash
   heroku config:set JWT_SECRET=your-secret-key
   heroku config:set NODE_ENV=production
   heroku config:set FRONTEND_URL=https://your-frontend.vercel.app
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **View logs**
   ```bash
   heroku logs --tail
   ```

### Production Deployment - Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   railway login
   ```

2. **Initialize project**
   ```bash
   railway init
   railway add
   ```

3. **Configure environment**
   - Add PostgreSQL plugin
   - Set environment variables in Railway dashboard

4. **Deploy**
   ```bash
   railway up
   ```

## 🎨 Frontend Setup & Deployment

### Local Development

1. **Setup**
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   ```

2. **Configure .env.local**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
   ```

3. **Start development**
   ```bash
   npm run dev
   ```

4. **Access application**
   - Open http://localhost:3000
   - Create account or login
   - Try messaging and deals features

### Production Deployment - Vercel

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/telegram-marketplace.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Select "frontend" directory as root

3. **Set environment variables in Vercel**
   - `NEXT_PUBLIC_API_URL` = your-backend-url/api
   - `NEXT_PUBLIC_SOCKET_URL` = your-backend-url

4. **Deploy**
   - Vercel will automatically deploy on push

### Production Deployment - Netlify

1. **Build and deploy**
   ```bash
   npm run build
   netlify deploy --prod
   ```

2. **Configure environment**
   - Go to Site settings → Build & deploy → Environment
   - Add `NEXT_PUBLIC_*` variables

## 🔗 Connecting Frontend & Backend

### Development
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- Already configured in `.env.local`

### Production
Update `.env` on production frontend with:
```env
NEXT_PUBLIC_API_URL=https://your-backend-domain/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend-domain
```

## 🔐 Security Checklist

- [ ] Change JWT_SECRET to a strong random string
- [ ] Enable HTTPS on all URLs
- [ ] Configure CORS properly in backend
- [ ] Set secure cookies (production only)
- [ ] Enable rate limiting
- [ ] Add input validation
- [ ] Sanitize user inputs
- [ ] Use environment variables for all secrets
- [ ] Enable database backups
- [ ] Monitor error logs

## 🧪 Testing the Application

### Test Authentication Flow
```bash
# Signup
POST http://localhost:5000/api/auth/register
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "display_name": "Test User"
}

# Login
POST http://localhost:5000/api/auth/login
{
  "email": "test@example.com",
  "password": "password123"
}
```

### Test Real-time Features
1. Open app in two browser windows
2. Create two accounts
3. Add one as contact to another
4. Send message - should appear instantly

### Test Marketplace
1. Create a deal as user 1
2. Login as user 2
3. View deals - should see user 1's deal
4. Click "Message Seller" - should open chat

## 📊 Monitoring & Logging

### Backend Logs
```bash
# Heroku
heroku logs --tail

# Railway
railway logs
```

### Frontend Errors
- Check browser console (F12)
- Check network tab for API errors
- Use React Developer Tools extension

### Database
```bash
# Connect to PostgreSQL
psql -U postgres -d telegram_marketplace

# Check message count
SELECT COUNT(*) FROM messages;

# Check online users
SELECT * FROM sessions WHERE is_online = true;

# View recent deals
SELECT * FROM deals ORDER BY created_at DESC LIMIT 5;
```

## 🚨 Troubleshooting

### Backend won't start
```bash
# Check port is not in use
lsof -i :5000

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Database connection fails
```bash
# Test PostgreSQL connection
psql -U postgres -d telegram_marketplace -c "SELECT 1"

# Check credentials in .env
```

### Frontend won't connect to backend
- Check API URL in `.env.local`
- Verify backend is running
- Check browser network tab for CORS errors
- Check firewall/proxy settings

### Messages not appearing
- Check Socket.io connection in browser console
- Verify both frontend and backend environments
- Check JWT token validity

## 📈 Scaling Recommendations

1. **Database**
   - Add read replicas for high load
   - Implement caching (Redis)
   - Archive old messages

2. **Backend**
   - Use load balancer
   - Deploy multiple instances
   - Use message queue (RabbitMQ, Kafka)

3. **Frontend**
   - Enable CDN
   - Optimize bundle size
   - Implement lazy loading

4. **Infrastructure**
   - Use container orchestration (Kubernetes)
   - Set up auto-scaling
   - Implement CI/CD pipeline

## 📞 Support Resources

- Backend Issues: Check backend logs
- Frontend Issues: Check browser console
- Database Issues: Check PostgreSQL logs
- Socket.io Issues: Check browser Network tab

## 🎉 Next Steps

1. ✅ Deploy backend
2. ✅ Deploy frontend
3. ✅ Test full application
4. ✅ Configure custom domain
5. ✅ Set up monitoring
6. ✅ Implement backups
7. ✅ Add analytics
8. ✅ Prepare for scaling
