const express = require("express");
const { createServer } = require("http");
const { join } = require("path");
const { Server } = require("socket.io");

const app = express();
const server = createServer(app);
const io = new Server(server);

// Servir tanto index.html como useractive.html desde la misma ruta
app.use(express.static(join(__dirname, "")));

// Array para almacenar la lista de productos
let productList = [];
let productListAdded = [];

// Endpoint GET para obtener la lista de productos
app.get("/product-list", (req, res) => {
  res.json(productList);
});

app.get("/product-list-added", (req, res) => {
  res.json(productListAdded);
});

// Emitir la lista actual de productos a cualquier usuario que se conecte
io.on("connection", (socket) => {
  console.log("a user connected");
  io.emit("product list", productList); // Enviar la lista de productos al cliente recién conectado
  io.emit("product list added", productListAdded); // Enviar la lista de productos al cliente recién conectado
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  // Escuchar cuando se añada un nuevo producto y actualizar la lista
  socket.on("product added", (productName) => {
    productList.push(productName);
    console.log("Current product list:", productList);
    io.emit("product list", productList); // Emite la lista de productos a todos los clientes conectados
  });

  socket.on("product added voice", (productName) => {
    productListAdded.push(productName);
    console.log("Current product list sonido:", productListAdded);
    io.emit("product list added", productListAdded); // Emite la lista de productos a todos los clientes conectados
  });

  // Eliminar un producto específico de productListAddedd
  socket.on("product deleted voice", (productName) => {
    console.log("Producto a eliminar name:", productName);
    productListAdded.forEach((product, index) => {
      if (product.name === productName) {
        productListAdded.splice(index, 1);
      }
    }
    );
    console.log("Current product list sonido deleted:", productListAdded);
    io.emit("product list added", productListAdded);
  });

  // Eliminar un producto específico de productList
  socket.on("product deleted", (productName) => {
    const index = productList.indexOf(productName);
    if (index !== -1) {
      productList.splice(index, 1);
    }
    console.log("Current product list:", productList);
    io.emit("product list", productList);
  });

  // Escuchar el evento de cambio de lista
  socket.on("changeList", (list) => {
    productListAdded = list;
    io.emit("product list added", productListAdded);
  });
});

// Manejar la conexión de usuario a /useractive.html
app.get("/useractive.html", (req, res) => {
  // Emitir el evento cuando el usuario se conecta a /useractive.html
  io.emit("user connected");
  // Emitir la lista actual de productos al usuario que se conecta
  io.emit("product list", productList);
  // Responder con el archivo useractive.html
  res.sendFile(join(__dirname, "./useractive/useractive.html"));
});

// Configurar el controlador de ruta para la página /cart.html
app.get("/cart.html", (req, res) => {
  // Emitir el evento cuando el usuario se conecta a /cart.html
  io.emit("user connected");

  // Responder con el archivo cart.html
  res.sendFile(join(__dirname, "./cart/cart.html"));
});

// Configurar el controlador de ruta para la página /cajero.html
app.get("/cajero.html", (req, res) => {
  // Emitir el evento cuando el usuario se conecta a /cajero.html
  io.emit("user connected");

  // Emitir la lista actual de productos añadidos al usuario que se conecta a /cajero.html
  console.log("Current product list added:", productListAdded);
  io.to("cajero").emit("product list added", productListAdded);

  // Responder con el archivo cajero.html
  res.sendFile(join(__dirname, "./QRCODE/cajero.html"));
});

// Escuchar conexiones de Socket.IO
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});

// Escuchar el evento de eliminación de producto por voz
io.on("product deleted voice", (productName) => {
  console.log("Producto a eliminar name:", productName);
  const index = productListAdded.indexOf(productName);
  console.log("Index:", index);
  if (index !== -1) {
    productListAdded.splice(index, 1);
  }
  console.log("Current product list sonido deleted:", productListAdded);
  io.emit("product list added", productListAdded); // Emitir la lista actualizada de productos añadidos
});
