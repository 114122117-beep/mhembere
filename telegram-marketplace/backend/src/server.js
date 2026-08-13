// backend/src/server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/groups', require('./routes/groupRoutes'));
app.use('/api/deals', require('./routes/dealRoutes'));

// Socket.io Real-time Events
const activeUsers = new Map(); // Track active users

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // User joins
  socket.on('user-join', (userId) => {
    activeUsers.set(userId, socket.id);
    io.emit('user-online', { userId, status: 'online' });
  });

  // Private message
  socket.on('send-message', (data) => {
    const { sender_id, receiver_id, content } = data;
    io.to(activeUsers.get(receiver_id)).emit('receive-message', {
      sender_id,
      receiver_id,
      content,
      timestamp: new Date()
    });
  });

  // Group message
  socket.on('send-group-message', (data) => {
    const { group_id, sender_id, content } = data;
    socket.broadcast.emit('receive-group-message', {
      group_id,
      sender_id,
      content,
      timestamp: new Date()
    });
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { receiver_id, sender_id } = data;
    io.to(activeUsers.get(receiver_id)).emit('user-typing', { sender_id });
  });

  // Mark message as read
  socket.on('message-read', (data) => {
    const { message_id, reader_id } = data;
    io.emit('message-status', { message_id, status: 'read' });
  });

  // Disconnect
  socket.on('disconnect', () => {
    activeUsers.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        activeUsers.delete(userId);
        io.emit('user-offline', { userId, status: 'offline' });
      }
    });
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, server, io };
