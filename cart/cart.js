//####################################################################################################################
//############################################## Eliminar Producto ###################################################


//####################################################################################################################
//############################################ Fin Eliminar Producto #################################################
//####################################################################################################################


//####################################################################################################################
//############################################ Shake                  #################################################
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
      }6
      ordenarLista();

    }
  } else {
    console.log('No se han proporcionado datos de aceleración.');
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
  productsArray.forEach(product => {
    productContainer.appendChild(product);
  });
}


// Agregar un listener para el evento 'devicemotion'
window.addEventListener('devicemotion', handleShake);


//####################################################################################################################
//############################################ Shake                  #################################################
//####################################################################################################################
