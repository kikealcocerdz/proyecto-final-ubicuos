# P2 - Prototipado

![alt text](public/READMEs/uc3m_white.png)

>
> ## Sistemas Interactivos y Ubicuos
>
> ## Miembros del Grupo
>
> - Enrique Alcocer Díaz (100472118)
> - Fan Wu Zhuo (100346155)
> - Iván Fernández Martín-Gil (100472263)
> - James Camp (100531121)
>
> ## Grupo 6
>
> ## Repositorio de GitHub
>
> [https://github.com/kikealcocerdz/proyecto-final-ubicuos](https://github.com/kikealcocerdz/proyecto-final-ubicuos)
>

---

## Índice

- [P2 - Prototipado](#p2---prototipado)
  - [Índice](#índice)
  - [Uso de la Aplicación](#uso-de-la-aplicación)
    - [Ejecución cliente remoto](#ejecución-cliente-remoto)
  - [Funcionalidades de la aplicación](#funcionalidades-de-la-aplicación)
    - [1. Mapa](#1-mapa)
    - [2. Carrito](#2-carrito)
    - [3. Generar y Manejar Código QR](#3-generar-y-manejar-código-qr)

---

## Uso de la Aplicación

Para ejecutar la aplicación, es necesario ejecutar node.js en la carpeta raíz del proyecto:

```console
~$: node index.js
```

Seguidamente, en un navegador web se puede acceder a la dirección <http://localhost:3000/> para visualizar la aplicación. En el caso de que el cliente y el servidor se encuentren en la misma red. En el caso de que el cliente y el servidor se encuentren en redes distintas, ver el apartado [ejecución cliente remoto](#ejecución-cliente-remoto).

En la aplicación y más en concreto en la página principal, existe la opción de acceder a un "manual" de uso de la aplicación, que se encuentra en la esquina superior derecha de la página con un icono de `i` en un círculo. Al hacer clic, se abrirá una ventana emergente con información sobre cómo utilizar la aplicación.

Para la última parte, correspondiente al pago, en la parte del cliente, tras pulsar `finalizar compra`, se redirigirá a la página `pagofinal.html` donde se podrá realizar el pago tras escaner un código QR que se genera en el cajero.

En el lado del servidor (el cajero), se redirigirá a la página `cajero.html` donde se muestran los productos y el precio total de la compra, debajo hay un botón para generar el código QR, que tras pulsarlo se generará el código QR que se debe escanear desde la página del cliente.

Finalmente en el lado del cliente, tras escanear el código QR, se tendrán dos opciones:

- Realizar el pago, redirigiendo a una página de PayPal.
- Comprar de nuevo, redirigiendo a la página principal de la aplicación.

### Ejecución cliente remoto

Para ejecutar el cliente en un dispositivo remoto, hay varias alternativas, como por ejemplo el uso de tunelización con herramientas como ngrok, cloudfared, etc.
En nuestro caso, hemos optado por usar [ngrok](https://ngrok.com/product/secure-tunnels) siguiendo los pasos detallados en la [guía de instalación](https://ngrok.com/docs/getting-started/). Aún así detallamos algunos pasos relevantes a continuación:

1. Instalar ngrok en el sistema.

    ```console
    ~$: brew install ngrok/ngrok/ngrok
    ```

    Para otros sistemas operativos, se puede seguir la [guía de instalación](https://ngrok.com/docs/getting-started/?os=macos#step-1-install).

2. Es necesario crear un cuenta (de forma gratuita, en nigún caso es necesario pagar) en la página de ngrok.

3. Una vez tengamos una cuenta creada y ngrok instalado, ejecutamos el siguiente comando en la terminal:

    ```console
    ~$: ngrok authtoken <TOKEN>
    ```

    Para obtener el token, seguir los pasos detallados en el paso `2. Connect your account` de la [guía de instalación](https://ngrok.com/docs/getting-started/?os=macos#step-2-connect-your-account).

4. Finalmente, para ejecutar el cliente en un dispositivo remoto, ejecutamos el siguiente comando en la terminal:

    ```console
    ~$: ngrok http http://localhost:3000
    ```

    Este comando mostrará en pantalla algo del estilo:

    ```console
        ngrok                                                    (Ctrl+C to quit)
        Session Status                online
        Account                       inconshreveable (Plan: Free)
        Version                       3.0.0
        Region                        United States (us)
        Latency                       78ms
        Web Interface                 http://127.0.0.1:4040
        Forwarding                    https://84c5df474.ngrok-free.dev -> http://localhost:8080

        Connections                   ttl     opn     rt1     rt5     p50     p90
                                      0       0       0.00    0.00    0.00    0.00
    ```

    Por tanto, tenemos que copiar el enlace que aparece en la línea `Forwarding` en el navegador del dispositivo remoto para acceder a la aplicación, en este caso (`https://84c5df474.ngrok-free.dev`). En el dispositivo remoto (es posible conectarse con varior dispositivos, sin embargo, nuestra aplicación sólo tiene en mente un cliente y servidor), una vez introducido el enlace en el navegador, debemos darle al botón de `Visit Site`.

Siguiendo estos pasos, se podrá acceder a la aplicación desde un dispositivo remoto.

---

## Funcionalidades de la aplicación

La aplicación cuenta con las siguientes funcionalidades:

### 1. [Mapa](mapa/README.md)

1. [Flecha de Orientación](mapa/README.md#handlemotionevent)

    - handleOrientation(event)
    - handleMotion(event)

2. [Mapa Interactivo](mapa/README.md#renderproductsproductlist)

    - renderProducts(productList)
    - getProductList()

3. [Barra Nutricional](mapa/README.md#progresimagevalue-op)

    - progresImage(value, op)

4. [SpeechAPI](mapa/README.md#API-de-Reconocimiento-de-Voz)

    - searchImage(query)
    - getProductImageUrl(productName)

### 2. [Carrito](cart/README.md)

1. [Eliminar Producto](cart/README.md#eliminar-producto)

    - addProduct(productName)
    - addProductRest(productName)
    - handleDeviceOrientation(event)

2. [Agitar para Ordenar](cart/README.md#agitar-para-ordenar)

   - handleShake(event)
   - ordenarLista()

3. [Marcar Favorito](cart/README.md#marcar-favorito)

    - favorite(event)
    - DOMContentLoaded
    - productsAll.forEach()

### 3. [Generar y Manejar Código QR](QRCode/README.md)

1. [Generar Código QR](QRCode/README.md#Eventos-y-Funciones)

    - addEventListener('click', function ())

2. [Gestión de Código QR](QRCode/README.md#Eventos-y-Funciones)

    - handleQRScanned()

---

**Universidad Carlos III de Madrid** | **Sistemas Interactivos y Ubicuos** | **Grupo 6**
