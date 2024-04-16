var orient = 0;
if ('DeviceMotionEvent' in window && 'DeviceOrientationEvent' in window) {
    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener('devicemotion', handleMotion);
    
    function handleOrientation(event) {
        var arrow = document.getElementById('arrow');
        var alpha = event.alpha; // Obtén el valor de la orientación del dispositivo

        if (alpha > 0 && alpha < 90){
             orient = 0;
        }
        else if (alpha > 90 && alpha < 180){
            orient = 1;
        }
        else if (alpha > 180 && alpha < 270){
              orient = 2;
        }
        else{
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

    function handleMotion(event) {
        var arrow = document.getElementById('arrow');
        var accelerationX = event.accelerationIncludingGravity.x;
       

        // Velocidad de movimiento en píxeles por segundo
        var speed = 10;

        // Calcula el cambio en la posición de la flecha
        var deltaX = accelerationX * speed;
        

        // Obtiene la posición actual de la flecha
        var currentX = parseFloat(window.getComputedStyle(arrow).left);
        var currentY = parseFloat(window.getComputedStyle(arrow).top);

        // Calcula la nueva posición de la flecha
        if (orient ==0){
        var newX = currentX + deltaX;}
        else if (orient ==1){
        var newX = currentX - deltaX;}
        else if (orient ==2){
        var newX = currentX - deltaX;}
        else{
        var newX = currentX + deltaX;}

        // Aplica la nueva posición a la flecha
        arrow.style.left = newX + 'px';
        arrow.style.top = newY + 'px';
    }
}

// Obtener el botón y el área de transcripción del DOM
const startButton = document.getElementById('startButton');
const transcriptionDiv = document.getElementById('transcription');

let textoAñadido = ""; // Variable para almacenar el texto añadido

// Verificar si el navegador soporta la API de reconocimiento de voz
if ('webkitSpeechRecognition' in window) {
  // Crear un nuevo objeto de reconocimiento de voz
  const recognition = new webkitSpeechRecognition();

  // Configurar opciones del reconocimiento
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'es-ES'; // Idioma español 

  // Cuando se detecta un resultado parcial
  recognition.onresult = function(event) {
    let interimTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        const finalTranscript = event.results[i][0].transcript;
        // Verificar si el texto contiene la palabra "añadir"
        if (finalTranscript.toLowerCase().includes("añadir")) {
          // Obtener el texto después de la palabra "añadir"
          textoAñadido = finalTranscript.substring(finalTranscript.indexOf("añadir") + 6, finalTranscript.indexOf("añadir") + 12).trim();
          console.log("Texto añadido:", textoAñadido);

        }
        interimTranscript += finalTranscript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
    transcriptionDiv.innerHTML = interimTranscript;
  };

  // Cuando se detiene el reconocimiento
  recognition.onend = function() {
    console.log('Reconocimiento de voz detenido.');
  };

  // Cuando ocurre un error
  recognition.onerror = function(event) {
    console.error('Error en el reconocimiento de voz:', event.error);
  };
  var empezar = false;
  // Cuando se presiona el botón de inicio
  startButton.addEventListener('click', function() {
    // Comenzar el reconocimiento
    if (empezar == false){
        recognition.start();
        empezar = true;
        startButton.textContent = 'Escuchando...';
    }
    else{
        recognition.stop();
        empezar = false;
        startButton.textContent = 'Iniciar';
    }
  });
} else {
  // Si el navegador no soporta la API de reconocimiento de voz
  console.error('El navegador no soporta la API de reconocimiento de voz.');
  startButton.disabled = true;
  startButton.textContent = 'No soportado';
}


