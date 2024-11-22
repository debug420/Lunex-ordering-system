function isSKU(string) {
    return /^[0-9]{4}$/.test(string);
}

function getCartFromSessionStorage() {
    let cart = new Map();
    for (let i = 0; i < sessionStorage.length; i++) {
        if (isSKU(sessionStorage.key(i))) {
            cart.set(sessionStorage.key(i), sessionStorage.getItem(sessionStorage.key(i)));
        }
    }
    return cart;
}

export {isSKU, getCartFromSessionStorage};