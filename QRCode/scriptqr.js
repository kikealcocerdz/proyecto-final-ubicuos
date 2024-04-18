document.getElementById('generateQR').addEventListener('click', function () {
    var qrCodeDiv = document.getElementById('qrCode');
    var qrValue = 'https://paypal.me/kikealcocer?country.x=ES&locale.x=es_ES'; // Valor a codificar en el QR
    qrCodeDiv.innerHTML = ''; // Limpiar el contenido anterior

    // Verificar si la biblioteca QRCode está disponible
    if (typeof QRCode !== 'undefined') {
        // Generar el código QR
        new QRCode(qrCodeDiv, {
            text: qrValue,
            width: 256,
            height: 256,
            top: 0,
            left: 0
        });
        console.log('QR generado:', qrValue);

        // Añadir evento de clic al código QR
        qrCodeDiv.addEventListener('click', handleQRScanned);

    } else {
        // Mostrar un mensaje de error si la biblioteca no está disponible
        qrCodeDiv.innerHTML = "Error: La biblioteca QRCode no está disponible";
        console.error('Error: La biblioteca QRCode no está disponible');
    }
});

// Función para manejar el evento de escaneo del código QR
function handleQRScanned() {
    // Cambiar el valor de una variable al escanear el QR
    var qrVariable = "Aqui es donde hay que hacer el mensaje de pagado etc.";
    console.log('Variable cambiada:', qrVariable);
}
