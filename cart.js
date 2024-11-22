import {getCartFromSessionStorage, setSessionStorageMap, getSessionStorageMap} from "./module.js";

const backButton = document.getElementById("backButton");
backButton.onclick = function() {
    window.location.href = "index.html";
}

function changeQuantity(SKU, byAmount) {
    let productData = getSessionStorageMap(SKU);
    productData.set("Quantity", Number(productData.get("Quantity")) + byAmount);
    if (Number(productData.get("Quantity")) > 0) {
        setSessionStorageMap(SKU, productData);
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

getCartFromSessionStorage().forEach((productData, productSKU) => {

    const productName = productData.get("Product Name");
    const productQuantity = productData.get("Quantity");
    const productPrice = productData.get("Selling Price");

    const tableRow = document.createElement("tr");
    cartTable.appendChild(tableRow);

    // Product Name
    const productNameTable = document.createElement("td");
    productNameTable.textContent = "[" + productSKU + "] " + productName + " (" + productData.get("Carton Size") + ")";
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

        const newQuantity = changeQuantity(productSKU, 1);
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

        const newQuantity = changeQuantity(productSKU, -1);
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

    let exportedString = "";

    getCartFromSessionStorage().forEach((productData, productSKU) => {

        const productVariationID = productData.get("ID");
        const productQuantity = productData.get("Quantity");
        const productSellingPrice = productData.get("Selling Price");

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