//####################################################################################################################
//############################################## Eliminar Producto ###################################################
//####################################################################################################################
var socketDelete = io(); // Conecta al mismo servidor que el archivo server.html
var socket = io(); // Conecta al mismo servidor que el archivo server.html
const cartItems = [
  "lista-placeholder",
  "product-lista",
  "product-image",
  "product-description",
  "button",
];
const star = "-star";
let productsAll = document.querySelectorAll(".lista-container");
const popup = document.getElementById("popup");
const productListContainer = document.getElementById("product-list");
const productListContainerRest = document.getElementById("product-list-rest");

// Si un elemento de la lista de productos se mantiene seleccionado y el dispositivo es girado 180 grados, eliminar el producto
document.addEventListener("DOMContentLoaded", function () {
  console.log(document.querySelectorAll(".lista-placeholder"));

  let selected = null;
  let originalColor = null;
  // Función para agregar un producto a la lista en el cliente
  function addProduct(productName) {
    const item = document.createElement("div");
    item.classList.add("lista-placeholder");

    const button = document.createElement("button");
    button.classList.add("product-lista");

    const img = document.createElement("img");
    img.classList.add("product-image");
    img.src = "https://via.placeholder.com/100";
    img.alt = productName;

    const description = document.createElement("div");
    description.classList.add("product-description");

    const nameParagraph = document.createElement("p");
    nameParagraph.textContent = productName.name;

    const priceContainer = document.createElement("div");
    priceContainer.classList.add("product-price-container");

    const pricePerUnit = document.createElement("p");
    pricePerUnit.textContent = productName.price;

    const totalPrice = document.createElement("p");
    totalPrice.textContent = productName.totalPrice;

    const favimage = document.createElement("img");
    favimage.id = productName.name + "-star";
    favimage.classList.add("fav-image");
    favimage.src = productName.isFavorite
      ? "../public/star-filled.png"
      : "../public/star-unfilled.png";
    favimage.alt = productName.isFavorite;

    priceContainer.appendChild(favimage);
    priceContainer.appendChild(pricePerUnit);
    priceContainer.appendChild(totalPrice);
    description.appendChild(nameParagraph);
    description.appendChild(priceContainer);

    button.id = productName.name;
    button.appendChild(img);
    button.appendChild(description);
    item.appendChild(button);
    item.id = productName.name;

    productListContainer.appendChild(item);
  }

  function addProductRest(productName) {
    const item = document.createElement("div");
    item.classList.add("item-lista");
    const img = document.createElement("img");
    img.alt = productName.name;
    img.src = productName.imageUrl;
    img.width = 60;
    img.height = 60;
    item.appendChild(img);
    const p = document.createElement("p");
    p.textContent = productName.name;
    item.appendChild(p);
    productListContainerRest.appendChild(item);
  }

  productsAll.forEach((product) => {
    product.addEventListener("touchstart", (event) => {
      console.log(event.target.className);
      if (
        cartItems.includes(event.target.className) &&
        !event.target.id.includes(star)
      ) {
        event.preventDefault();
        let touchMoved = false;
        console.log("Evento touchstar: ", event.target);
        // Get the background color of the event
        let defaultColor = window.getComputedStyle(
          event.target
        ).backgroundColor;
        const touchTimer = setTimeout(() => {
          if (!touchMoved) {
            // If the product is selected, change its color
            if (selected) {
              selected.style.backgroundColor = originalColor;
            }
            selected = event.target;
            originalColor = defaultColor;
            selected.style.backgroundColor = "#da692afa";
          }
        }, 100);
      } else if (event.target.id.includes(star)) {
        event.target.addEventListener("click", favorite(event));
      }
    });
  });

  window.addEventListener("deviceorientation", function (event) {
    const productsDeleted = this.document.querySelectorAll(".product-lista");

    // Convertir la lista de nodos a un array para poder ordenarla
    let productsArrayDeleted = Array.from(productsDeleted);
    let initialRotation = {
      alpha: 0,
      beta: 90,
      gamma: 0,
    };
    if (initialRotation === undefined) {
      initialRotation.alpha = event.alpha;
      initialRotation.beta = event.beta;
      initialRotation.gamma = event.gamma;
      console.log("Initial rotation:", initialRotation);
    } else {
      const rotationDifferenceAlpha = Math.abs(
        event.alpha - initialRotation.alpha
      );
      if (rotationDifferenceAlpha > 90 && rotationDifferenceAlpha < 120.5) {
        console.log("The device has been rotated 90 degrees.");
        console.log("Product to be deleted:", selected);
        console.log("Lista de productos:", productsArrayDeleted);

        // Vibrar solo en respuesta a la sacudida
        if (navigator.vibrate) {
          navigator.vibrate(2000);
        }
        console.log("Producto seleccionado:", selected);
        const index = productsArrayDeleted.indexOf(selected); // Encuentra el índice del elemento seleccionado
        console.log("Index del producto a eliminar:", index);
        if (index !== -1) {
          // Elimina el elemento del array
          productsArrayDeleted.splice(index, 1);
          // Elimina el elemento del DOM
          selected.parentNode.removeChild(selected);
          // Emitir el nombre del producto eliminado al servidor
          socketDelete.emit("product deleted voice", selected.id);
          console.log(
            "Lista de productos después de eliminar:",
            productsArrayDeleted
          );
        }
      }
    }
  });
  // Solicitar la lista de productos al servidor cuando se carga la página
  window.onload = function () {
    socket.emit("get product list added");
    console.log("Solicitando lista de productos al servidor...");
    // Manejar la respuesta del servidor con la lista de productos
    socket.on("product list", function (productList) {
      console.log("Lista de productos recibida:", productList);
      // Limpiar la lista actual de productos en el cliente
      productListContainer.innerHTML = "";
      // Agregar cada producto de la lista recibida al cliente
      productList.forEach(function (productName) {
        console.log("Producto recibido:", productName);
        addProductRest(productName);
      });
    });

    socket.on("product list added", function (productListAdded) {
      console.log("Lista de productos recibida por voz:", productListAdded);
      // Limpiar la lista actual de productos en el cliente
      productListContainer.innerHTML = "";
      // Agregar cada producto de la lista recibida al cliente
      productListAdded.forEach(function (productName) {
        console.log("Producto recibido por voz:", productName);
        addProduct(productName);
      });
    });
  };

});
//####################################################################################################################
//############################################ Fin Eliminar Producto #################################################
//####################################################################################################################

//####################################################################################################################
//############################################# Agitar para Ordenar ##################################################
//####################################################################################################################
// Función para manejar el evento de shake
function handleShake(event) {
  if (event.acceleration) {
    const accelerationX = event.acceleration.x;
    const accelerationY = event.acceleration.y;
    const accelerationZ = event.acceleration.z;

    const accelerationMagnitude = Math.sqrt(
      accelerationX * accelerationX +
        accelerationY * accelerationY +
        accelerationZ * accelerationZ
    );

    const shakeThreshold = 15;

    if (accelerationMagnitude > shakeThreshold) {
      // Ordena la lista

      ordenarLista();
    }
  } else {
    console.log("No se han proporcionado datos de aceleración.");
  }
}

// Función para ordenar la lista de productos
function ordenarLista() {
  const productContainer = document.getElementById("product-list");
  const products = productContainer.querySelectorAll(".lista-placeholder");

  // Convertir la lista de nodos a un array para poder ordenarla
  const productsArray = Array.from(products);

  // Ordenar los elementos el nombre del producto
  productsArray.sort((a, b) => {
    const nameA = a.id.toUpperCase();
    const nameB = b.id.toUpperCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });

  // Limpiar el contenedor de productos
  productContainer.innerHTML = "";

  // Agregar los elementos ordenados de vuelta al contenedor
  productsArray.forEach((product) => {
    productContainer.appendChild(product);
  });
}

// Agregar un listener para el evento 'devicemotion'
window.addEventListener("devicemotion", handleShake);

//####################################################################################################################
//############################################ Fin Agitar para Ordenar ###############################################
//####################################################################################################################

//####################################################################################################################
//############################################### Marcar Favorito ####################################################
//####################################################################################################################
function favorite(event) {
  if ("webkitSpeechRecognition" in window) {
    // Crear un nuevo objeto de reconocimiento de voz
    const recognition = new webkitSpeechRecognition();
    console.log("Reconocimiento de voz creado");
    let interimTranscript ="";
    // Configurar opciones del reconocimiento
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "es-ES"; // Idioma español
    recognition.start();
    setTimeout(() => {recognition.stop();
      console.log("Reconocimiento de voz detenido");
    }, 5000);
    // Cuando se detecta un resultado parcial
    recognition.onresult = function (evento) {
      for (let i = evento.resultIndex; i < evento.results.length; ++i) {
        if (evento.results[i].isFinal) {
          const finalTranscript = evento.results[i][0].transcript;
          console.log("Texto reconocido:", finalTranscript);
          // Verificar si el texto contiene la palabra "añadir"
          if (finalTranscript.toLowerCase().includes("favorito")) {
            console.log("Se ha dicho favorito");
            
            let favimage = event.target;
            console.log("item: ", favimage);

            console.log("Producto es favorito? ", favimage.alt);

            let currentWeb = new URL(window.location.href);
            let origin = currentWeb.origin;
            let starFilled = origin + "/public/star-filled.png";
            let starUnfilled = origin + "/public/star-unfilled.png";

            if (favimage.src === starUnfilled) {
              favimage.src = starFilled;
              favimage.alt = true;
            } else {
              favimage.src = starUnfilled;
              favimage.alt = false;
            }
          }
          interimTranscript += finalTranscript;
      } else {
        interimTranscript += evento.results[i][0].transcript;
      }
    }
    console.log("Texto transcripción:", interimTranscript);
        }
        }
  }
  
//####################################################################################################################
//############################################# Fin marcar Favorito ##################################################
//####################################################################################################################



