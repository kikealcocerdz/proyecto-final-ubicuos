var orient = 0;
var cercanos = 0;
const diccionario = { 'abc12': 'Tomate', 'def34': 'Lechuga' }
var socket = io();

// Creamos un objeto para almacenar las URLs de las imágenes de los productos
const productImageUrls = {};

async function searchImage(query) {
  const apiKey = "AIzaSyAafRWOvQCkLrS8h0OIZBufu71PqVTBzEg";
  const cxId = "d4b0870a6d6414dde";
  const numResults = 1;

  const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cxId}&q=${query}&num=${numResults}&searchType=image`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].link;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al buscar imagen:", error);
    return null;
  }
}

const getProductImageUrl = (() => {
  let timeout;
  return async (productName) => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      // Verificamos si ya tenemos la URL de la imagen en cache
      if (productImageUrls[productName]) {
        return productImageUrls[productName];
      }

      // Si no está en cache, llamamos a la función de búsqueda de imágenes
      const imageUrl = await searchImage(productName);
      // Almacenamos la URL en cache para futuras referencias
      productImageUrls[productName] = imageUrl;
      return imageUrl;
    }, 2500); // Tiempo de espera en milisegundos antes de ejecutar la búsqueda
  };
})();


if ('DeviceMotionEvent' in window && 'DeviceOrientationEvent' in window) {
  window.addEventListener('deviceorientation', handleOrientation);
  window.addEventListener('deviceorientation', handleMotion);
  //####################################################################################################################
  //############################################# Flecha Del Mapa ######################################################
  //####################################################################################################################

  function handleOrientation(event) {
    var arrow = document.getElementById('arrow');
    var alpha = event.alpha; // Obtén el valor de la orientación del dispositivo
    document.addEventListener('click', function (event) {
      // Obtener las coordenadas x e y del punto donde se hizo clic/touch
      var x = event.clientX;
      var y = event.clientY;

      // Imprimir las coordenadas en la consola
      console.log("Posición X:", x, "Posición Y:", y);
    });

    if (alpha > 0 && alpha < 90) {
      orient = 0;
    }
    else if (alpha > 90 && alpha < 180) {
      orient = 1;
    }
    else if (alpha > 180 && alpha < 270) {
      orient = 2;
    }
    else {
      orient = 3;
    }

    console.log(orient);


    if (alpha !== null) {
      // Convierte el valor de alpha a radianes
      var rotation = -alpha * (Math.PI / 180);


      // Aplica la rotación a la flecha
      arrow.style.transform = 'rotate(' + rotation + 'rad)';
    }
  }
  var newX = 0;
  var newY = 0;
  var mover = 0;
  var fotomapa = 0;

  function handleMotion(event) {
    var arrow = document.getElementById('arrow');
    var accelerationX = 10;


    var compass = document.getElementById('compass');
    compass.innerHTML = 'Aceleración en x: ' + accelerationX + 'newX: ' + newX + 'newY: ' + newY;

    // Velocidad de movimiento en píxeles por segundoS
    var speed = 0.1;

    // Calcula el cambio en la posición de la flecha
    var mover = accelerationX * speed;


    // Obtiene la posición actual de la flecha
    console.log(window.getComputedStyle(arrow).left);
    var currentX = parseFloat(window.getComputedStyle(arrow).left);
    var currentY = parseFloat(window.getComputedStyle(arrow).top);

    // Calcula la nueva posición de la flecha
    if (orient == 0) {
      var newY = currentY - mover;
    }
    else if (orient == 1) {
      var newX = currentX - mover;
    }
    else if (orient == 2) {
      var newY = currentY + mover;
    }
    else {
      var newX = currentX + mover;
    }

    // Aplica la nueva posición a la flecha
    arrow.style.left = newX + 'px';
    arrow.style.top = newY + 'px';

    //####################################################################################################################
    //############################################# Fin Flecha Del Mapa ##################################################
    //####################################################################################################################

    //####################################################################################################################
    //############################################# Mapa Interactivo######################################################
    //####################################################################################################################

    //Controla en que parte del mapa esta la flecha para mostrar los cercanos,util para otra seccion del codigo
    if (currentX >= 470) {
      if (currentY >= 470) {//derecha abajo
        cercanos = 1;
      }
      else {
        cercanos = 2;//derecha arriba
      }
    }
    else {
      if (currentY >= 470) {//izquierda abajo
        cercanos = 3;
      }
      else {
        cercanos = 4;//izquierda arriba
      }
    }

    // Función para renderizar los productos en la sección "near-products"
    function renderProducts(productList) {
      const nearProductsContainer = document.getElementById("near-products");
      nearProductsContainer.innerHTML = ""; // Limpiar la sección antes de renderizar

      productList.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");

        const productImg = document.createElement("img");
        productImg.alt = product.name;

        // Obtener la URL de la imagen del producto
        getProductImageUrl(product.name)
          .then((imageUrl) => {
            if (imageUrl) {
              productImg.src = imageUrl;
            } else {
              productImg.src = "https://via.placeholder.com/100"; // Si no se encuentra ninguna imagen, muestra un marcador de posición
            }
          })
          .catch((error) => {
            console.error("Error al buscar imagen:", error);
            productImg.src = "https://via.placeholder.com/100"; // En caso de error, muestra un marcador de posición
          });
        console.log("urls", productImageUrls)
        const productName = document.createElement("p");
        productName.textContent = product.name;
        productDiv.id = productName.textContent;
        productDiv.appendChild(productImg);
        productDiv.appendChild(productName);
        if (product.location === cercanos) {
          nearProductsContainer.appendChild(productDiv);
        }
      });
    }
    // Escuchar la lista de productos desde el servidor
    socket.on("product list", function (productList) {
      console.log(productList);
      console.log("Productos recibidos");
      renderProducts(productList);
    });

    // Función para realizar una solicitud GET al endpoint /product-list
    function getProductList() {
      fetch("/product-list")
        .then((response) => response.json())
        .then((productList) => {
          console.log(productList);
          console.log("Productos recibidos");
          renderProducts(productList);
        })
        .catch((error) =>
          console.error("Error al obtener la lista de productos:", error)
        );
    }

    // Llamar a la función para obtener la lista de productos cuando se carga la página
    getProductList();


    //Funcion para mostrar el mapa con progreso

    if (currentX > 420 && currentX < 460 && currentY > 420 && currentY < 460) {
      fotomapa = 1;
    }
    else if (currentX > 420 && currentX < 460 && currentY > 250 && currentY < 290) {
      fotomapa = 2;
    }
    else if (currentX > 300 && currentX < 340 && currentY > 230 && currentY < 270) {
      fotomapa = 3;
    }
    else if (currentX > 310 && currentX < 350 && currentY > 155 && currentY < 195) {
      fotomapa = 4;
    }
    else if (currentX > 625 && currentX < 665 && currentY > 142 && currentY < 182) {
      fotomapa = 5;
    }
    //Funcion para mostrar el mapa que corresponde depeniendo de la fase de compra del usuario
    var map = document.getElementById('image');
    console.log("El mapa actual es:", fotomapa);
    if (fotomapa == 0) {
      console.log("Primer mapa");
      map.src = "../public/mapa-images/mapa1.png";
    }
    else if (fotomapa == 1) {
      console.log("Segundo mapa");
      map.src = "../public/mapa-images/mapa2.png";
    }
    else if (fotomapa == 2) {
      console.log("Tercer mapa");
      map.src = "../public/mapa-images/mapa3.png";
    }
    else if (fotomapa == 3) {
      console.log("Cuarto mapa");
      map.src = "../public/mapa-images/mapa4.png";
    }
    else if (fotomapa == 4) {
      map.src = "../public/mapa-images/mapa5.png";
      console.log("Quinto mapa");
    }
    else if (fotomapa == 5) {
      console.log("Sexto mapa");
      map.src = "../public/mapa-images/mapa6.png";
    }
    else { map.src = "../public/mapa-images/mapaoriginal.png"; }
    console.log("la posicion del puntero es:", currentX, currentY);
    console.log("Cercanos:", cercanos);
  }
  //####################################################################################################################
  //############################################# Fin de Mapa Interactivo###############################################
  //####################################################################################################################
}


//####################################################################################################################
//############################################# Barra Nutricional#####################################################
//####################################################################################################################
const diccionarioNutricional = { 'Tomate': 5, 'Leche': 3, 'Cereales': 1 }
let carrito = [];
let valorNutricional = 0;

const progresImage = (value, op) => {
  let PesoNutricional = 0;
  const imageContainer = document.getElementById("image-container");
  console.log("El valor del producto es:", value);
  //Añadimos o eliminamos en el carrito local el producto en cuestion
  if (op == 1) {
    carrito.push(value);
  } else {
    carrito.pop(value);
  }
  //Recalculamos el peso nutricional
  for (let i = 0; i < carrito.length; i++) {
    PesoNutricional += diccionarioNutricional[carrito[i]];
  }

  //Definimos el valor de la variable 
  valorNutricional = (PesoNutricional / carrito.length);
  // Dependiendo del valor de la variable, selecciona la imagen correspondiente
  imageContainer.src = "";
  if (carrito.length === 0) {
    imageContainer.src = "";
  } else if (valorNutricional > 1 && valorNutricional <= 2) {
    imageContainer.src = "../public/mapa-images/fase1.png";
  } else if (valorNutricional > 2 && valorNutricional <= 3) {
    imageContainer.src = "../public/mapa-images/fase2.png";
  } else if (valorNutricional > 3 && valorNutricional <= 4) {
    imageContainer.src = "../public/mapa-images/fase3.png";
  } else if (valorNutricional > 4 && valorNutricional < 5) {
    imageContainer.src = "../public/mapa-images/fase5.png";
  } else if (valorNutricional == 5) {
    imageContainer.src = "../public/mapa-images/fase5.png";
  }
};
//####################################################################################################################
//############################################# Fin Barra Nutricional ################################################
//####################################################################################################################


//####################################################################################################################
//############################################# SpeechAPI#############################################################
//####################################################################################################################
// Obtener el botón y el área de transcripción del DOM
const startButton = document.getElementById('startButton');
//const transcriptionDiv = document.getElementById('transcription');
const transformarCodigo = { "abc12": "Tomate", "a": "Leche", "b": "Cereales" }
let textoAñadido = ""; // Variable para almacenar el texto añadido
let productoAñadido = ""; // Variable para almacenar el texto añadido
let productFinal = ""; // Variable para almacenar el producto final
var socket2 = io();
console.log('Reconocimiento de voz creado.');

// Verificar si el navegador soporta la API de reconocimiento de voz
if ('webkitSpeechRecognition' in window) {
  // Crear un nuevo objeto de reconocimiento de voz
  const recognition = new webkitSpeechRecognition();

  // Configurar opciones del reconocimiento
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'es-ES'; // Idioma español 

  // Cuando se detecta un resultado parcial
  recognition.onresult = function (event) {
    let interimTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        const finalTranscript = event.results[i][0].transcript;
        // Verificar si el texto contiene la palabra "añadir"
        if (finalTranscript.toLowerCase().includes("añadir")) {
          // Obtener el texto después de la palabra "añadir"
          productoAñadido = finalTranscript.substring(finalTranscript.indexOf("añadir") + 6, finalTranscript.indexOf("añadir") + 12).trim();
          console.log("Texto añadido:", productoAñadido);
          navigator.vibrate(200);
          productFinal = transformarCodigo[productoAñadido];
          if (productFinal !== undefined) {
            const productContent = {
              name: productFinal, // Este será el nombre del producto añadido
              imageUrl: "", // Esta será la URL de la imagen
              price: "$5.99 / lb", // Puedes establecer el precio predeterminado o dejarlo vacío
              totalPrice: 5.99, // Puedes establecer el precio total predeterminado o dejarlo vacío
              isFavorite: false, // Puedes establecer el valor predeterminado de isFavoritea
            };
            socket2.emit("product added voice", productContent);
            console.log("Producto añadido:", productFinal);
            if (productContent.name != undefined) {
              progresImage(productContent.name, 1);

            }
          }
        }
        interimTranscript += finalTranscript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
    console.log("Texto transcripción:", interimTranscript);
  };


  // Cuando se detiene el reconocimiento
  recognition.onend = function () {
    console.log('Reconocimiento de voz detenido.');
  };

  // Cuando ocurre un error
  recognition.onerror = function (event) {
    console.error('Error en el reconocimiento de voz:', event.error);
  };

  var empezar = false;
  // Cuando se presiona el botón de inicio
  startButton.addEventListener('click', function () {
    console.log('Botón de inicio presionado.');
    // Comenzar el reconocimiento
    if (empezar == false) {
      recognition.start();
      empezar = true;
    }
    else {
      recognition.stop();
      empezar = false;
    }
  });
} else {
  // Si el navegador no soporta la API de reconocimiento de voz
  console.error('El navegador no soporta la API de reconocimiento de voz.');
  startButton.disabled = true;
  startButton.textContent = 'No soportado';
}
//####################################################################################################################
//############################################# Fin SpeechAPI#########################################################
//####################################################################################################################



