function isSKU(string) {
    return /^[0-9]{4}$/.test(string);
}

function getCartFromSessionStorage() {
    let cart = new Map();
    for (let i = 0; i < sessionStorage.length; i++) {
        const productSKU = sessionStorage.key(i);
        if (isSKU(productSKU)) {
            cart.set(productSKU, getSessionStorageMap(productSKU));
        }
    }
    return cart;
}

function setSessionStorageMap(SKU, productMapData) {
    sessionStorage.setItem(SKU, JSON.stringify(Array.from(productMapData.entries())));
}

function getSessionStorageMap(SKU) {
    return new Map(JSON.parse(sessionStorage.getItem(SKU)));
}

export {isSKU, getCartFromSessionStorage, setSessionStorageMap, getSessionStorageMap};