var orient = 0;
var cercanos = 0;
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
        var accelerationX = Math.abs(event.acceleration.x);

        var compass = document.getElementById('compass');
        compass.innerHTML = 'Aceleración en x: ' + accelerationX + 'newX: ' + newX + 'newY: ' + newY;   

        // Velocidad de movimiento en píxeles por segundoS
        var speed = 0.1;

        // Calcula el cambio en la posición de la flecha
        var deltaX = accelerationX * speed;
        

        // Obtiene la posición actual de la flecha
        var currentX = parseFloat(window.getComputedStyle(arrow).left);
        var currentY = parseFloat(window.getComputedStyle(arrow).top);

        // Calcula la nueva posición de la flecha
        if (orient ==0){
        var newX = currentY + deltaY;}
        else if (orient ==1){
        var newX = currentX - deltaX;}
        else if (orient ==2){
        var newX = currentY - deltaY;}
        else{
        var newX = currentX + deltaX;}

        // Aplica la nueva posición a la flecha
        arrow.style.left = newX + 'px';
        arrow.style.top = newY + 'px';

        //Controla en que parte del mapa esta la flecha para mostrar los cercanos
        if (newX > 100){
            if (newY > 100){
                cercanos = 1;}
            else{
                cercanos = 2;}}
        else{
            if (newY > 100){
                cercanos = 3;}
            else{
                cercanos = 4;
            }}
       
    
    //Funcion para mostrar el mapa con progreso
    var fotomapa = 0;
    if (newX > 100 && newY > 100){
        fotomapa =1;}
    else if (newX < 100 && newY > 100){
        fotomapa =2;}
    else if (newX < 100 && newY < 100){
        fotomapa =3;}
    else if (newX > 100 && newY < 100){
        fotomapa =4;}
    else{
        fotomapa = 0;
    }

    var map = document.getElementById('image');
        
        if (fotomapa == 0){
            map.src = "mapa/mapa1.png";}
        else if (fotomapa == 1){
            map.src = "mapa/mapa2.png";}
        else if (fotomapa == 2){
            map.src = "mapa/mapa3.png";}
        else if(fotomapa == 3){
            map.src = "mapa/mapa4.png";}
        else if (fotomapa == 4){
            map.src = "mapa/mapa5.png";}
        else if (fotomapa == 5){
            map.src = "mapa/mapa6.png";}
        else {map.src = "mapa/mapaoriginal.png";}
        
    
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

const progresImage = (value) => {

    const imageContainer = document.querySelector("#image-container");
    const tasksfinished = document.querySelector("#finish-container");
    tasksfinished.innerHTML = "";
    let imageUrl = "";
    let value=0;
    for (let element of carrito) {
        value+=element.valornutricional;
    }
    //Definimos el valor de la variable value
    if (carrito.length>0)
    {value=value/carrito.length;}
    else {value=0;}
  
    // Dependiendo del valor de la variable, selecciona la imagen correspondiente
    if (taskList.length === 0) {
      imageUrl = "";
  }else if (value === 0) {
      imageUrl = "mapa/fase5.png";
    }else if (value > 0 && value <= 0.25) {
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


