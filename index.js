const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');

const appChat = express();
const appIndex = express();

const chatServer = createServer(appChat);
const indexServer = createServer(appIndex);

const ioChat = new Server(chatServer);
const ioIndex = new Server(indexServer);

// Servir el archivo index.html en el puerto 3000
appChat.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// Servir el archivo server.html en el puerto 3001
appIndex.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'server.html'));
});

ioChat.on('connection', (chatSocket) => {
  console.log('a user connected to chat');

  chatSocket.on('disconnect', () => {
    console.log('user disconnected from chat');
  });

  // Escuchar los mensajes del chat y retransmitirlos a todos los clientes conectados
  chatSocket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    ioChat.emit('chat message', msg); // Emite el mensaje a todos los clientes conectados en el servidor chat
  });
});

ioIndex.on('connection', (indexSocket) => {
  console.log('a user connected to index');

  indexSocket.on('disconnect', () => {
    console.log('user disconnected from index');
  });
});

indexServer.listen(3000, () => {
  console.log('Chat server running at http://localhost:3000');
});

chatServer.listen(3001, () => {
  console.log('Index server running at http://localhost:3001');
});
