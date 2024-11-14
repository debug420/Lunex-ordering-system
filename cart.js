const backButton = document.getElementById("backButton");
backButton.onclick = function() {
    window.location.href = "index.html";
}

function isSKU(string) {
    return /^[0-9]{4}$/.test(string);
}

function getCartFromSessionStorage() {
    let cart = new Map();
    for (i = 0; i < sessionStorage.length; i++) {
        if (isSKU(sessionStorage.key(i))) {
            cart.set(sessionStorage.key(i), JSON.parse(sessionStorage.getItem(sessionStorage.key(i))));
        }
    }
    return cart;
}

function changeQuantity(SKU, byAmount) {
    let productData = JSON.parse(sessionStorage.getItem(SKU));
    productData[2] = Number(productData[2]) + byAmount;
    if (Number(productData[2]) > 0) {
        sessionStorage.setItem(SKU, JSON.stringify(productData));
    } else {
        sessionStorage.removeItem(SKU);
    }
    return productData[2];
}

const cartTable = document.getElementById("cartTableBody");

getCartFromSessionStorage().forEach((productData, SKU) => {

    const productName = productData[0];
    const productQuantity = productData[2];
    const productPrice = productData[3];

    const tableRow = document.createElement("tr");
    cartTable.appendChild(tableRow);

    // Product Name
    const productNameTable = document.createElement("td");
    productNameTable.textContent = "[" + SKU + "] " + productName;
    tableRow.appendChild(productNameTable);

    // Pricing
    const productPricingTable = document.createElement("td");
    productPricingTable.textContent = "$" + parseFloat(Number(productQuantity) * productPrice).toFixed(2) + " (" + productQuantity + " * $" + productPrice + ")";
    tableRow.appendChild(productPricingTable);

    // Add and remove actions
    const increaseQButtonWrapper = document.createElement("td");
    const increaseQButton = document.createElement("button");
    increaseQButton.textContent = "+";
    tableRow.appendChild(increaseQButtonWrapper);
    increaseQButtonWrapper.appendChild(increaseQButton);
    increaseQButton.onclick = function() {
        const newQuantity = changeQuantity(SKU, 1);
        productPricingTable.textContent = "$" + parseFloat(newQuantity * productPrice).toFixed(2) + " (" + newQuantity + " * $" + productPrice + ")";
    }

    const decreaseQButtonWrapper = document.createElement("td");
    const decreaseQButton = document.createElement("button");
    decreaseQButton.textContent = "-";
    tableRow.appendChild(decreaseQButtonWrapper);
    decreaseQButtonWrapper.appendChild(decreaseQButton);
    decreaseQButton.onclick = function() {
        const newQuantity = changeQuantity(SKU, -1);
        if (newQuantity > 0) {
            // Update pricing
            productPricingTable.textContent = "$" + parseFloat(newQuantity * productPrice).toFixed(2) + " (" + newQuantity + " * $" + productPrice + ")";
        } else {
            // Delete from cart
            tableRow.remove();
        };
    }

})

// Init datatables.js
new DataTable("#cartTable", {
    columnDefs: [{
    "defaultContent": "",
    "targets": "_all"
    }],
    layout: {
        topStart: "search",
        topEnd: null,
        bottomStart: null,
        bottomEnd: null
    },
    paging : false,
    "oLanguage": {
        "sEmptyTable": "Cart is empty"
    }
});