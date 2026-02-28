require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const musicianRoutes = require('./routes/musicianRoutes');
const messageRoutes = require('./routes/messageRoutes'); // ✅ NUEVO

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/musicians', musicianRoutes);
app.use('/api/messages', messageRoutes); // ✅ NUEVO

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
});