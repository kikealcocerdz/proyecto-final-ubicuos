const express = require('express');
const { createServer } = require('http');
const { join } = require('path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

// Servir tanto index.html como useractive.html desde la misma ruta
app.use(express.static(join(__dirname, '')));

// Array para almacenar la lista de productos
let productList = [];
let productListAdded = [];

// Endpoint GET para obtener la lista de productos
app.get('/product-list', (req, res) => {
  res.json(productList);
});

app.get('/product-list-added', (req, res) => {
  res.json(productList);
});


// Emitir la lista actual de productos a cualquier usuario que se conecte
io.on('connection', (socket) => {
  console.log('a user connected');
  io.emit('product list', productList); // Enviar la lista de productos al cliente recién conectado
  io.emit('product list added', productListAdded); // Enviar la lista de productos al cliente recién conectado
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // Escuchar cuando se añada un nuevo producto y actualizar la lista
  socket.on('product added', (productName) => {
    productList.push(productName);
    console.log('Current product list:', productList);
    io.emit('product list', productList); // Emite la lista de productos a todos los clientes conectados
  });

  socket.on('product added voice', (productName) => {
    productListAdded.push(productName);
    console.log('Current product list sonido:', productListAdded);
    io.emit('product list added', productListAdded); // Emite la lista de productos a todos los clientes conectados
  }
  );
});

// Manejar la conexión de usuario a /useractive.html
app.get('/useractive.html', (req, res) => {
  // Emitir el evento cuando el usuario se conecta a /useractive.html
  io.emit('user connected');
  // Emitir la lista actual de productos al usuario que se conecta
  io.emit('product list', productList);
  // Responder con el archivo useractive.html
  res.sendFile(join(__dirname, './useractive/useractive.html'));
});

app.get('/cart.html', (req, res) => {
  // Emitir el evento cuando el usuario se conecta a /cart.html
  io.emit('user connected');

  // Emitir la lista actual de productos añadidos al usuario que se conecta a /cart.html
  console.log('Current product list added:', productListAdded);
  io.to('cart').emit('product list added', productListAdded); // Cambio aquí

  // Responder con el archivo cart.html
  res.sendFile(join(__dirname, './cart/cart.html'));
});

app.get('/cajero.html', (req, res) => {
  // Emitir el evento cuando el usuario se conecta a /cart.html
  io.emit('user connected');

  // Emitir la lista actual de productos añadidos al usuario que se conecta a /cart.html
  console.log('Current product list added:', productListAdded);
  io.to('cajero').emit('product list added', productListAdded); // Cambio aquí

  // Responder con el archivo cart.html
  res.sendFile(join(__dirname, './QRCODE/cajero.html'));
});



// Escuchar conexiones de Socket.IO
server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});
