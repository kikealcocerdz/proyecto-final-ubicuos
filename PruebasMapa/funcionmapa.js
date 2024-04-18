var orient = 0;
var cercanos = 0;
const diccionario = { 'abc12': 'Tomate', 'def34': 'Lechuga' }


if ('DeviceMotionEvent' in window && 'DeviceOrientationEvent' in window) {
  window.addEventListener('deviceorientation', handleOrientation);
  window.addEventListener('deviceorientation', handleMotion);

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

    //Controla en que parte del mapa esta la flecha para mostrar los cercanos
    if (newX >= 470) {
      if (newY >= 470) {//derecha abajo
        cercanos = 1;
      }
      else {
        cercanos = 2;//derecha arriba
      }
    }
    else {
      if (newY >= 470) {//izquierda abajo
        cercanos = 3;
      }
      else {
        cercanos = 4;//izquierda arriba
      }
    }


    //Funcion para mostrar el mapa con progreso
    var fotomapa = 0;
    if (newX > 470 && newX < 500 && newY > 575 && newY < 600) {
      fotomapa = 1;
    }
    else if (newX > 450 && newX < 480 && newY > 350 && newY < 380) {
      fotomapa = 2;
    }
    else if (newX > 300 && newX < 340 && newY > 440 && newY < 480) {
      fotomapa = 3;
    }
    else if (newX > 340 && newX < 380 && newY > 270 && newY < 310) {
      fotomapa = 4;
    }
    else if (newX > 690 && newX < 730 && newY > 300 && newY < 340) {
      fotomapa = 5;
    }

    var map = document.getElementById('image');

    if (fotomapa == 0) {
      map.src = "mapa/mapa1.png";
    }
    else if (fotomapa == 1) {
      map.src = "mapa/mapa2.png";
    }
    else if (fotomapa == 2) {
      map.src = "mapa/mapa3.png";
    }
    else if (fotomapa == 3) {
      map.src = "mapa/mapa4.png";
    }
    else if (fotomapa == 4) {
      map.src = "mapa/mapa5.png";
    }
    else if (fotomapa == 5) {
      map.src = "mapa/mapa6.png";
    }
    else { map.src = "mapa/mapaoriginal.png"; }
  }

}

// Obtener el botón y el área de transcripción del DOM
const startButton = document.getElementById('startButton');
//const transcriptionDiv = document.getElementById('transcription');
const transformarCodigo = { "abc12": "Tomate" }
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
          productFinal = transformarCodigo[productoAñadido];
          socket2.emit("product added voice", productFinal);
          console.log("Producto añadido:", productFinal);
          progresImage("productillo", productFinal.name);
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

const diccionarioNutricional = { 'Tomate': 5, 'Leche': 3, 'Cereales': 1 }

const progresImage = (value) => {
  const imageContainer = document.querySelector("#image-container");
  const tasksfinished = document.querySelector("#finish-container");
  tasksfinished.innerHTML = "";
  let imageUrl = "";
  for (let element of carrito) {
    value += element.valornutricional;
  }
  //Definimos el valor de la variable value
  if (carrito.length > 0) { value = value / carrito.length; }
  else { value = 0; }

  // Dependiendo del valor de la variable, selecciona la imagen correspondiente
  if (taskList.length === 0) {
    imageUrl = "";
  } else if (value === 0) {
    imageUrl = "mapa/fase5.png";
  } else if (value > 0 && value <= 0.25) {
    imageUrl = "mapa/fase4.png";
  } else if (value > 0.25 && value <= 0.66) {
    imageUrl = "mapa/fase3.png";
  } else if (value > 0.66 && value < 1) {
    imageUrl = "mapa/fase2.png";
  } else if (value == 1) {
    imageUrl = "mapa/fase1.png";
  }

  // Rellena el div con la imagen seleccionada
  imageContainer.innerHTML = `<img src="${imageUrl}" alt="ImagenValorNutricional">`;
};

