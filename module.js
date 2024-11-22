function isSKU(string) {
    return /^[0-9]{4}$/.test(string);
}

function getCartFromSessionStorage() {
    const cart = new Map();
    Object.keys(sessionStorage).forEach(productSKU => {
        if (isSKU(productSKU)) {
            cart.set(productSKU, getSessionStorageMap(productSKU));
        }
    });
    return cart;
}

function setSessionStorageMap(SKU, productMapData) {
    sessionStorage.setItem(SKU, JSON.stringify([...productMapData.entries()]));
}

function getSessionStorageMap(SKU) {
    return new Map(JSON.parse(sessionStorage.getItem(SKU)));
}

export { isSKU, getCartFromSessionStorage, setSessionStorageMap, getSessionStorageMap };
