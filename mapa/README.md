# Documentación de funcionmapa.js

Aquí se describe la funcionalidad implementada en el archivo `funcionmapa.js`. 
Este archivo contiene el código JavaScript que se encarga de mostrar la orientación del dispositivo, la posición de la flecha en el mapa y los productos cercanos en la interfaz de usuario, así como de manejar la barra nutricional y el reconocimiento de voz.

## Variables Globales

- `orient`: Variable que almacena la orientación del dispositivo.
- `cercanos`: Variable que indica la ubicación cercana.
- `diccionario`: Objeto que mapea códigos de productos a nombres de productos.
- `socket`: Variable que representa el socket de comunicación.
- `productImageUrls`: Objeto que almacena las URLs de las imágenes de los productos.

## Funciones

### `searchImage(query)`

- Descripción: Realiza una búsqueda de imágenes en Google Custom Search API basada en una consulta proporcionada.
- Parámetros:
  - `query`: Consulta para buscar la imagen.
- Devuelve: La URL de la primera imagen encontrada o `null` si no se encuentra ninguna.
- Uso: Utilizada para buscar la imagen de un producto.

### `getProductImageUrl(productName)`

- Descripción: Obtiene la URL de la imagen de un producto.
- Parámetros:
  - `productName`: Nombre del producto.
- Devuelve: La URL de la imagen del producto.
- Uso: Utilizada para obtener la URL de la imagen de un producto y almacenarla en caché.

### `handleOrientation(event)`

- Descripción: Maneja el evento de orientación del dispositivo y rota una flecha en la interfaz de usuario.
- Parámetros:
  - `event`: Evento de orientación del dispositivo.
- Uso: Utilizada para mostrar la orientación del dispositivo mediante una flecha.

### `handleMotion(event)`

- Descripción: Maneja el evento de movimiento del dispositivo y actualiza la posición de la flecha en el mapa.
- Parámetros:
  - `event`: Evento de movimiento del dispositivo.
- Uso: Utilizada para mostrar la posición de la flecha en un mapa interactivo.

### `renderProducts(productList)`

- Descripción: Renderiza los productos en la interfaz de usuario.
- Parámetros:
  - `productList`: Lista de productos a renderizar.
- Uso: Utilizada para mostrar los productos cercanos en la interfaz de usuario.

### `getProductList()`

- Descripción: Obtiene la lista de productos del servidor.
- Uso: Utilizada para obtener la lista de productos al cargar la página.

### `progresImage(value, op)`

- Descripción: Actualiza la imagen de la barra nutricional según los productos añadidos.
- Parámetros:
  - `value`: Valor del producto añadido.
  - `op`: Operación (añadir o eliminar) realizada con el producto.
- Uso: Utilizada para mostrar el progreso nutricional en la interfaz de usuario.

## Eventos

- `deviceorientation`: Evento que se dispara cuando cambia la orientación del dispositivo.
- `click`: Evento que se dispara al hacer clic en la pantalla.

## API de Reconocimiento de Voz

- Descripción: Permite al usuario agregar productos utilizando comandos de voz.
- Funcionamiento: Al presionar el botón de inicio, se activa el reconocimiento de voz.
Los comandos de voz que contienen la palabra "añadir" seguida del nombre del producto agregarán ese producto al carrito.
