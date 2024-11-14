const backButton = document.getElementById("backButton");
backButton.onclick = function() {
    window.location.href = "index.html";
}

function getCartFromSessionStorage() {
    let cart = new Map();
    for (i = 0; i < sessionStorage.length; i++) {
        // if statement ensures that other elements (such as sessionStorage items by extensions) are not added to cart
        if (/^[0-9]+$/.test(sessionStorage.key(i)))
            cart.set(sessionStorage.key(i), JSON.parse(sessionStorage.getItem(sessionStorage.key[i])));
    }
    return cart;
}