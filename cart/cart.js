//####################################################################################################################
//############################################## Eliminar Producto ###################################################
var socketDelete = io(); // Conecta al mismo servidor que el archivo server.html
const cartItems = [
  "lista-placeholder",
  "product-lista",
  "product-image",
  "product-description",
  "button",
];
let productsAll = document.querySelectorAll(".lista-container");

// Si un elemento de la lista de productos se mantiene seleccionado y el dispositivo es girado 180 grados, eliminar el producto
document.addEventListener("DOMContentLoaded", function () {
  console.log(document.querySelectorAll(".lista-placeholder"));

  let selected = null;
  let originalColor = null;

  productsAll.forEach((product) => {
    product.addEventListener("touchstart", (event) => {
      console.log(event.target.className);
      if (cartItems.includes(event.target.className)) {
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
        let initialRotation = {
          alpha: 0,
          beta: 90,
          gamma: 0,
        };
        let productsAll = [];
        // Añadir todos los hijos de listacontainer a productsAll
        productListContainer.childNodes.forEach((product) => {
          productsAll.push(product);
        });
        console.log("Productos en la lista:", productsAll);

        window.addEventListener("deviceorientation", function (event) {
          if (initialRotation === undefined) {
            initialRotation.alpha = event.alpha;
            initialRotation.beta = event.beta;
            initialRotation.gamma = event.gamma;
            console.log("Initial rotation:", initialRotation);
          } else {
            const rotationDifferenceAlpha = Math.abs(
              event.alpha - initialRotation.alpha
            );
            if (
              rotationDifferenceAlpha > 90 &&
              rotationDifferenceAlpha < 90.5
            ) {
              console.log("The device has been rotated 90 degrees.");
              console.log("Product to be deleted:", selected);
              socketDelete.on("product delete voice", function (selected) {
                console.log("Lista de productos:", productListAdded);
                console.log("Podructo a eliminar:", selected);
                productListAdded.pop(selected);
                console.log(
                  "Lista de productos después de eliminar:",
                  productListAdded
                );
                io.emit("product list added", productListAdded);
              });
            }
          }
        });
      }
    });
  });
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

      // Vibrar solo en respuesta a la sacudida
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
      6;
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
//############################################ Fin Agitar para Ordenar #################################################
//####################################################################################################################
