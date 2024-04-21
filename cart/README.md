# Documentación del Código JavaScript (cart.js)

Este documento proporciona una descripción detallada del código JavaScript contenido en el archivo cart.js.

## Variables Globales

- `socketDelete`: Variable que establece la conexión con el servidor para gestionar la eliminación de productos.
- `cartItems`: Un array que contiene las clases de elementos del carrito de la compra.
- `star`: Un sufijo utilizado para identificar elementos relacionados con las estrellas de favoritos.
- `productsAll`: Un NodeList que contiene todos los elementos de productos presentes en la página.
- `popup`: Una referencia al elemento de ventana emergente utilizado para mostrar detalles del producto.

## Eliminar Producto

Este bloque de código se encarga de la funcionalidad para eliminar un producto de la lista cuando el dispositivo se gira entre 90º y 120.5º.

### Funciones de Eliminar Producto

- `addProduct(productName)`: Esta función agrega un nuevo producto a la lista de productos en la interfaz de usuario.

- `addProductRest(productName)`: Aquí, se agrega un producto a la lista de productos restantes en la interfaz de usuario.

- `handleDeviceOrientation(event)`: Esta función maneja el evento de orientación del dispositivo.
Si el dispositivo se gira 180 grados, se activa la eliminación del producto seleccionado.

En este bloque de código, se establece un listener para el evento deviceorientation.
Cuando el dispositivo se gira, se calcula la diferencia de ángulo (en este caso, en torno al eje alpha) entre la orientación inicial y la orientación actual del dispositivo. Si esta diferencia es mayor que un cierto umbral (entre 90º y 120.5º) y el producto está seleccionado, se elimina el producto de la lista y se notifica al servidor sobre la eliminación.

Este manejo de eventos también incluye la vibración del dispositivo para proporcionar retroalimentación háptica al usuario cuando se elimina un producto.

### Referencias de Eliminar Producto

- <https://developer.mozilla.org/en-US/docs/Web/API/Device_orientation_events/Detecting_device_orientation>
- <https://developer.mozilla.org/en-US/docs/Web/API/Device_orientation_events/Orientation_and_motion_data_explained>

## Agitar para Ordenar

Este bloque de código maneja la funcionalidad para ordenar la lista de productos cuando el dispositivo se agita y produce una vibración.
Dicha vibración sólo se activa si previamente se interactua con la pantalla (tocarla), debido a protecciones implementadas en los navegadores.

### Funciones de Agitar para Ordenar

- `handleShake(event)`: Maneja el evento de agitación del dispositivo para ordenar la lista de productos.
- `ordenarLista()`: Ordena la lista de productos alfabéticamente por nombre.

## Marcar Favorito

Este bloque de código maneja la funcionalidad para marcar un producto como favorito al hacer clic en la estrella correspondiente.

### Funciones

- `favorite(event)`: Esta función se activa cuando se toca sobre el icono de la estrella de un producto.
Detecta si el producto ya está marcado como favorito o no, y cambia su estado en consecuencia:
  - Si el producto está marcado como favorito, cambia la imagen de la estrella a una estrella rellena y establece el atributo `alt` en `true`.
  - Si el producto no está marcado como favorito, cambia la imagen de la estrella a una estrella no rellena y establece el atributo `alt` en `false`.

  Para cambiar el estado, es necesario decir `favorito` en voz, habiendo tocado previamente la estrella del producto.

- `DOMContentLoaded`: Este evento se dispara cuando el HTML y los recursos asociados (como imágenes y estilos) han sido completamente cargados y analizados.
En este contexto, se utiliza para establecer un escuchador de eventos en todos los elementos de la lista de productos para detectar cuándo se hace clic en la estrella.
- `productsAll.forEach()`: Este método itera sobre todos los elementos de la lista de productos y añade un escuchador de eventos `touchstart` a cada uno.
Esto permite detectar interacciones táctiles en los productos y activar la función `favorite(event)` cuando se hace clic en la estrella de un producto específico.
