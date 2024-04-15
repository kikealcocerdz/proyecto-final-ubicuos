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



