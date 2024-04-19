//####################################################################################################################
//############################################## Eliminar Producto ###################################################
//####################################################################################################################

// Si un producto se mantiene seleccionado y el dispositivo es girado 180 grados, eliminar el producto
let productsList = document.querySelectorAll(".lista-container");
// get item-lista's children
let productsAll = [];
productsList.forEach((product) => {
  productsChildren.push(product.children);
});

// Si un elemento de la lista de productos se mantiene seleccionado y el dispositivo es girado 180 grados, eliminar el producto
productsAll.addEventListener("touchstart", (event) => {
    event.preventDefault();
    let touchMoved = false;
    const touchTimer = setTimeout(() => {
      if (!touchMoved) {
        // If the product is selected, change its color
        product.style.backgroundColor = "lightyellow";
      }
    }, 1500);
    let initialRotation;
    product.addEventListener("touchstart", function () {
      console.log("Producto seleccionado.");
      this.style.transform = "scale(1.1)";
      window.addEventListener("deviceorientation", function (event) {
        if (initialRotation === undefined) {
          initialRotation = event.alpha;
        } else {
          const rotationDifference = Math.abs(event.alpha - initialRotation);
          if (rotationDifference > 180 || rotationDifference < -180) {
            const product = document.querySelector(".product");
            console.log("Producto" + { product } +  "va a ser eliminado.");
            product.remove();
          }
        }
      });
    });
});

//####################################################################################################################
//############################################ Fin Eliminar Producto #################################################
//####################################################################################################################
