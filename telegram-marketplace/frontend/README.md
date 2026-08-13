# Telegram Marketplace Frontend

Modern Next.js React application for real-time messaging and marketplace functionality.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update `.env.local` with your configuration:
   - Backend API URL
   - Socket.io server URL

3. **Start development server**
   ```bash
   npm run dev
   ```

Navigate to `http://localhost:3000` in your browser.

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js app router
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── page.tsx           # Home/dashboard
│   ├── login/             # Login page
│   └── signup/            # Signup page
├── components/            # React components
│   ├── Chat/              # Messaging components
│   │   └── ChatInterface.tsx
│   ├── Deals/             # Marketplace components
│   │   └── DealsBoard.tsx
│   └── Common/            # Shared components
│       └── Sidebar.tsx
├── lib/                   # Utilities & services
│   ├── services/          # API calls
│   │   ├── authService.ts
│   │   └── apiService.ts
│   ├── hooks/             # Custom hooks
│   │   └── useSocket.ts
│   └── store/             # State management
│       └── authStore.ts
├── public/                # Static assets
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Pages & Components

### Pages
- **`/`** - Main dashboard (Messages/Marketplace)
- **`/login`** - User login
- **`/signup`** - User registration

### Components

#### Chat Interface
- Contact list with search
- Real-time message display
- Typing indicators
- Message history

#### Deals Board
- Marketplace listing with filters
- Search by keyword
- Filter by type (buying/selling) and category
- Create new deal modal
- Direct messaging from deals

#### Sidebar
- Navigation between Messages and Deals
- Quick access to settings
- Logout button

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API endpoint | http://localhost:5000/api |
| `NEXT_PUBLIC_SOCKET_URL` | WebSocket server URL | http://localhost:5000 |

### Tailwind CSS

Custom theme configuration in `tailwind.config.js`:
- Primary color: `#0088cc` (Telegram blue)
- Secondary color: `#f5f5f5`
- Dark color: `#212121`

## 📚 Features

### Authentication
- User registration with email
- Secure login with JWT
- Token persistence in localStorage
- Auto-logout on invalid token

### Messaging
- 1-on-1 private messaging
- Real-time message delivery
- Message history persistence
- Typing indicators
- Online/offline status

### Marketplace
- Create, read, update deal listings
- Filter by category and type (buying/selling)
- Search deals by keyword
- Direct messaging to sellers
- Deal inquiries system

### State Management
- **Zustand** for authentication state
- Persistent user session
- Easy to extend for additional stores

## 🔌 Real-time Features

### WebSocket Connection
Using `socket.io-client` with:
- Automatic reconnection
- Message delivery guarantee
- Real-time presence tracking

### Custom Hook: `useSocket`
```typescript
const { socket, on, emit, off } = useSocket()

// Listen for events
on('receive-message', (data) => {
  console.log('New message:', data)
})

// Send events
emit('send-message', { receiver_id: 123, content: 'Hello' })
```

## 🎯 API Integration

### Services

#### `authService`
- `register()` - Create new account
- `login()` - Authenticate user

#### `apiService`
- `messageService` - Message operations
- `groupService` - Group operations
- `userService` - User operations
- `dealService` - Marketplace operations

All services use Axios with:
- Automatic JWT token injection
- Error handling
- Retry logic (configurable)

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **Lucide React** for icons
- Responsive design (mobile-first)
- Dark mode ready (can be extended)

### Custom CSS Classes
```css
.chat-container    /* Main chat layout */
.message-input     /* Input field styling */
.btn-primary       /* Primary button */
.btn-secondary     /* Secondary button */
.modal-overlay     /* Modal backdrop */
```

## 🏗️ Building for Production

```bash
# Build
npm run build

# Start production server
npm start
```

### Optimizations
- Code splitting
- Image optimization
- Bundle analysis
- Performance monitoring

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Docker
```bash
docker build -t telegram-marketplace-frontend .
docker run -p 3000:3000 telegram-marketplace-frontend
```

## 📦 Dependencies

- **next** - React framework
- **react** - UI library
- **socket.io-client** - Real-time communication
- **axios** - HTTP client
- **zustand** - State management
- **lucide-react** - Icon library
- **tailwindcss** - CSS framework

## 🔄 Development Workflow

1. **Create component**
   ```bash
   # Create in components/FeatureName/Component.tsx
   ```

2. **Add types**
   - Define interfaces at the top of component files
   - Create shared types in `lib/types/` if needed

3. **Create API service**
   - Add methods to `lib/services/apiService.ts`
   - Use Axios instance with auto-auth

4. **Use custom hooks**
   - Create in `lib/hooks/`
   - Document with JSDoc comments

5. **Test locally**
   - Run `npm run dev`
   - Test with backend running

## 🐛 Debugging

### Chrome DevTools
- React Developer Tools
- Redux DevTools (if added)
- Network tab for API calls
- Application tab for localStorage

### Console Logging
```typescript
// Socket events
console.log('Socket event received:', data)

// API calls
console.log('API response:', response)

// Component lifecycle
console.log('Component mounted/updated')
```

### Common Issues

**Can't connect to backend?**
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify backend is running on correct port
- Check CORS configuration in backend

**WebSocket connection fails?**
- Check `NEXT_PUBLIC_SOCKET_URL`
- Verify Socket.io is running
- Check firewall/proxy settings

**Messages not appearing?**
- Check browser console for errors
- Verify token is valid (check localStorage)
- Check network tab for failed requests

## 📚 Further Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Socket.io Client Docs](https://socket.io/docs/v4/client-api/)
- [Zustand Docs](https://github.com/pmndrs/zustand)
