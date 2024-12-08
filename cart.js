import { getCartFromSessionStorage, setSessionStorageMap, getSessionStorageMap } from "./module.js";

const $backButton = $("#backButton");
$backButton.on("click", () => {
    window.location.href = "index.html";
});

function changeQuantity(SKU, byAmount) {
    const productData = getSessionStorageMap(SKU);
    productData.set("Quantity", Number(productData.get("Quantity")) + byAmount);
    if (Number(productData.get("Quantity")) > 0) {
        setSessionStorageMap(SKU, productData);
    } else {
        sessionStorage.removeItem(SKU);
    }
    return productData.get("Quantity");
}

const $totalText = $("#totalText");
let totalCost = 0;

function updateTotal() {
    $totalText.text(`Total: $${parseFloat(totalCost).toFixed(2)}`);
}

const $cartTable = $("#cartTableBody");

getCartFromSessionStorage().forEach((productData, productSKU) => {
    const productName = productData.get("Product Name");
    const productQuantity = productData.get("Quantity");
    const productPrice = productData.get("Selling Price");

    const $tableRow = $("<tr>").appendTo($cartTable);

    // Product Name
    const productNameText = `[${productSKU}] ${productName} (${productData.get("Carton Size")})`;
    $("<td>").text(productNameText).appendTo($tableRow);

    // Pricing
    const $productPricingCell = $("<td>").appendTo($tableRow);
    $productPricingCell.text(`$${(productQuantity * productPrice).toFixed(2)} (${productQuantity} * $${productPrice})`);
    totalCost += productQuantity * productPrice;

    // Add and Remove Buttons
    const $increaseButton = $("<button>")
        .attr("id", "increaseButton")
        .text("+")
        .on("click", () => {
            const newQuantity = changeQuantity(productSKU, 1);
            $productPricingCell.text(`$${(newQuantity * productPrice).toFixed(2)} (${newQuantity} * $${productPrice})`);
            totalCost += Number(productPrice);
            updateTotal();
        });

    const $decreaseButton = $("<button>")
        .attr("id", "decreaseButton")
        .text("-")
        .on("click", () => {
            const newQuantity = changeQuantity(productSKU, -1);
            totalCost -= Number(productPrice);
            if (newQuantity > 0) {
                $productPricingCell.text(`$${(newQuantity * productPrice).toFixed(2)} (${newQuantity} * $${productPrice})`);
            } else {
                $tableRow.remove();
            }
            updateTotal();
        });

    $("<td>").append($increaseButton).appendTo($tableRow);
    $("<td>").append($decreaseButton).appendTo($tableRow);
});

updateTotal();

// Initialize DataTables.js
new DataTable("#cartTable", {
    columnDefs: [
        {
            defaultContent: "",
            targets: "_all",
        },
    ],
    layout: {
        topStart: "search",
        topEnd: null,
        bottomStart: null,
        bottomEnd: null,
    },
    paging: false,
    oLanguage: {
        sEmptyTable: "Cart is empty",
    },
});

// Export Functionality
const $exportButton = $("#exportButton");
$exportButton.on("click", () => {
    let exportedString = "";

    getCartFromSessionStorage().forEach((productData) => {
        const productQuantity = productData.get("Quantity");
        const productVariationID = productData.get("ID")
        exportedString += `pos_product_row(${productVariationID}, null, null, ${productQuantity});\n`;
    });

    if (exportedString === "") {
        console.log("No items in cart to export...");
    } else {
        const blob = new Blob([exportedString], { type: "text/plain" });
        const $downloadLink = $("<a>")
            .attr({
                download: "export.lunex",
                href: URL.createObjectURL(blob),
            })
            .appendTo("body");

        $downloadLink[0].click();
        $downloadLink.remove();
    }
});

let productVariationPricingData = new Map();
const priceResponse = await fetch("productsprice.json");
const productPrices = await priceResponse.json();
productPrices.forEach(product => {

    let priceMap = new Map();
    priceMap.set("BASE", product["Base Selling Price"]);
    priceMap.set("Adelaide", product["Adelaide"]);
    priceMap.set("Bamyan", product["Bamyan"]);
    priceMap.set("BestWay 1", product["BestWay 1"]);
    priceMap.set("K.i grocery", product["K.i grocery"]);
    priceMap.set("Melbourne", product["Melbourne"]);
    priceMap.set("Zesty Tasty", product["Zesty Tasty"]);

    productVariationPricingData.set(product["sku"], priceMap);
});