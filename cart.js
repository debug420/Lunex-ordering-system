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

const totalText = document.getElementById("totalText");
let totalCost = 0;
function updateTotal() {
    totalText.textContent = "$" + parseFloat(totalCost).toFixed(2);
}

// function updateTotal() {

//     let tableData = $("#cartTable").DataTable().column(1).data();
//     let filterArray = [];

//     for (i = 0; i < tableData.length; i++) {
//         filterArray.push(tableData[i]);
//     }
    
//     const cleanedData = filterArray.map(data => {
//         return data.replace(/\$/g, '').replace(/\s*\([^)]*\)$/, '');
//     })

//     let sum = 0;
//     cleanedData.forEach(data => {
//         sum += Number(data);
//     })

//     totalText.textContent = "$" + parseFloat(sum).toFixed(2);

// }

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
    totalCost += Number(productQuantity) * productPrice;

    // Add and remove actions
    const increaseQButtonWrapper = document.createElement("td");
    const increaseQButton = document.createElement("button");
    increaseQButton.id = "increaseButton";
    increaseQButton.textContent = "+";
    tableRow.appendChild(increaseQButtonWrapper);
    increaseQButtonWrapper.appendChild(increaseQButton);
    increaseQButton.onclick = function() {

        const newQuantity = changeQuantity(SKU, 1);
        productPricingTable.textContent = "$" + parseFloat(newQuantity * productPrice).toFixed(2) + " (" + newQuantity + " * $" + productPrice + ")";
        totalCost += Number(productPrice);
        updateTotal();

    }

    const decreaseQButtonWrapper = document.createElement("td");
    const decreaseQButton = document.createElement("button");
    decreaseQButton.id = "decreaseButton";
    decreaseQButton.textContent = "-";
    tableRow.appendChild(decreaseQButtonWrapper);
    decreaseQButtonWrapper.appendChild(decreaseQButton);
    decreaseQButton.onclick = function() {

        const newQuantity = changeQuantity(SKU, -1);
        totalCost -= Number(productPrice);
        if (newQuantity > 0) {
            // Update pricing
            productPricingTable.textContent = "$" + parseFloat(newQuantity * productPrice).toFixed(2) + " (" + newQuantity + " * $" + productPrice + ")";
        } else {
            // Delete from cart
            tableRow.remove();
        };

        updateTotal();

    }

})

updateTotal();

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