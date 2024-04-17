const items = [];
const favorites = [];
const cart = [];

//Para añadir mas funcionalidad a las items
class item {
    constructor(name,image,location){
        this.name = name;
        this.image = image;
        this.location = location
    }

}

function favorite(item) {
    favorites.push(item);
    console.log(favorites);
}

function addToCart(item) {
    cart.push(item);
    console.log(cart);
}


function unFavorite(item) {
    var index = favorites.indexOf(item);
    if (index > -1){
        favorites.splice(index,1);
    } else {}
    console.log(favorites);
}

function removeCart(item) {
    var index = cart.indexOf(item);
    if (index > -1){
        cart.splice(index,1);
    } else {}
    console.log(favorites);
}

