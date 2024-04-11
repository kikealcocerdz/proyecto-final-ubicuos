const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

// Servir tanto index.html como server.html desde la misma ruta
app.use(express.static(join(__dirname, '')));

// Escuchar conexiones de Socket.IO
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // Escuchar los mensajes del chat y retransmitirlos a todos los clientes conectados
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    io.emit('chat message', msg); // Emite el mensaje a todos los clientes conectados
  });
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
