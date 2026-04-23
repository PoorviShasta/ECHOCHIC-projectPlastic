const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const cors = require('cors');
const QRCode = require('qrcode');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/api/qr-code', async (req, res) => {
  try {
    const { url, fileName } = req.body || {};

    if (!url) {
      return res.status(400).json({ message: 'URL is required.' });
    }

    let validatedUrl;
    try {
      validatedUrl = new URL(url).toString();
    } catch (error) {
      return res.status(400).json({ message: 'Please provide a valid URL.' });
    }

    const pngBuffer = await QRCode.toBuffer(validatedUrl, {
      type: 'png',
      width: 512,
      margin: 1,
      errorCorrectionLevel: 'H'
    });

    const safeName = String(fileName || 'cleanup-qr')
      .trim()
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase();
    const finalFileName = `${safeName || 'cleanup-qr'}.png`;

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="${finalFileName}"`);
    return res.send(pngBuffer);
  } catch (error) {
    return res.status(500).json({
      message: 'Failed to generate QR code.',
      error: error.message
    });
  }
});

// Socket.io for cleanup-room
const cleanupRoom = 'cleanup-room';

io.on('connection', (socket) => {
  console.log(`User ${socket.id} connected`);

  // Join cleanup-room on connect
  socket.join(cleanupRoom);
  socket.to(cleanupRoom).emit('user joined', { id: socket.id, message: 'A volunteer joined the cleanup chat.' });

  socket.on('chat message', (msg) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    io.to(cleanupRoom).emit('chat message', {
      id: socket.id,
      username: msg.username || 'Anonymous',
      message: msg.message,
      timestamp
    });
  });

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} disconnected`);
    socket.to(cleanupRoom).emit('user left', { id: socket.id, message: 'A volunteer left the cleanup chat.' });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`EchoChic chat server running on http://localhost:${PORT}`);
  console.log(`Chat room: ${cleanupRoom}`);
});
