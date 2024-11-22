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
            cart.set(sessionStorage.key(i), sessionStorage.getItem(sessionStorage.key(i)));
        }
    }
    return cart;
}

function changeQuantity(SKU, byAmount) {
    let productData = new Map(JSON.parse(sessionStorage.getItem(SKU)));
    productData.set("Quantity", Number(productData.get("Quantity")) + byAmount);
    if (Number(productData.get("Quantity")) > 0) {
        sessionStorage.setItem(SKU, JSON.stringify(Array.from(productData.entries())));
    } else {
        sessionStorage.removeItem(SKU);
    }
    return productData.get("Quantity");
}

const totalText = document.getElementById("totalText");
let totalCost = 0;
function updateTotal() {
    totalText.textContent = "Total: $" + parseFloat(totalCost).toFixed(2);
}

const cartTable = document.getElementById("cartTableBody");

getCartFromSessionStorage().forEach((data, SKU) => {
    let productData = new Map(JSON.parse(data));
    const productName = productData.get("Product Name");
    const productQuantity = productData.get("Quantity");
    const productPrice = productData.get("Selling Price");

    const tableRow = document.createElement("tr");
    cartTable.appendChild(tableRow);

    // Product Name
    const productNameTable = document.createElement("td");
    productNameTable.textContent = "[" + SKU + "] " + productName + " (" + productData.get("Carton Size") + ")";
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

// export functionality

const exportButton = document.getElementById("exportButton");
exportButton.onclick = function() {

    // Final export format goal:
    // pos_product_row(variationID, null, null, quantity)

    let finalCart = getCartFromSessionStorage();
    let exportedString = "";

    finalCart.forEach((productData, productSKU) => {

        const productName = productData[0];
        const productVariationID = productData[1];
        const productQuantity = productData[2];
        const productSellingPrice = productData[3];

        exportedString += "pos_product_row(" + productVariationID + ", null, null, " + productQuantity + ");\n"

    })

    if (exportedString === "") {
        console.log("No items in cart to export...");
    } else {
        // download file for user
        const blob = new Blob([exportedString], { type: "text/plain" });
        const downloadLink = document.createElement("a");
        downloadLink.download = "export.lunex";
        downloadLink.href = window.URL.createObjectURL(blob);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

}