require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const musicianRoutes = require('./routes/musicianRoutes');
const messageRoutes = require('./routes/messageRoutes');
const collaborationRoutes = require('./routes/collaborationRoutes');

const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

/* =========================
   MIDDLEWARES
========================= */
app.use(cors());
app.use(express.json());

/* =========================
   RUTAS REST
========================= */
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/musicians', musicianRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/collaborations', collaborationRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'AMPLIFY API running',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenido a AMPLIFY API',
    version: '1.0.0'
  });
});

/* =========================
   SOCKET.IO CONFIG
========================= */

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Usuarios conectados { userId: socketId }
const connectedUsers = {};

// 🔐 Autenticación del socket con JWT
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    socket.userId = decoded.id;
    connectedUsers[decoded.id] = socket.id;

    next();
  } catch (error) {
    return next(new Error("Authentication error"));
  }
});

// 📡 Eventos del chat
io.on('connection', (socket) => {
  console.log(`🟢 Usuario conectado: ${socket.userId}`);

  socket.on('send_message', async ({ receiverId, content }) => {
    try {
      const senderId = socket.userId;

      const result = await db.query(
        `INSERT INTO messages 
         (sender_id, receiver_id, content, created_at, read)
         VALUES ($1, $2, $3, NOW(), false)
         RETURNING *`,
        [senderId, receiverId, content]
      );

      const newMessage = result.rows[0];

      // Emitir al receptor si está conectado
      const receiverSocketId = connectedUsers[receiverId];

      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', newMessage);
      }

      // También enviar al emisor
      socket.emit('receive_message', newMessage);

    } catch (error) {
      console.error('❌ Error enviando mensaje:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔴 Usuario desconectado: ${socket.userId}`);
    delete connectedUsers[socket.userId];
  });
});

/* =========================
   START SERVER
========================= */

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});