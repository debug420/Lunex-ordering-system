import { getCartFromSessionStorage, setSessionStorageMap, getSessionStorageMap } from "./module.js";

getCartFromSessionStorage().forEach((productData, productSKU) => {

    const productName = productData.get("Product Name");
    const productQuantity = productData.get("Quantity");
    const productBrand = productData.get("Brand");
    const productPrice = productData.get("Selling Price");
    const productCartonSize = productData.get("Carton Size");

    const $tableRow = $("<tr>").appendTo($("#mainTableBody"));

    // Product Name
    const productNameText = `[${productSKU}] ${productName}`;
    $("<td>").text(productNameText).appendTo($tableRow);

    // Product Brand
    $("<td>").text(productBrand).appendTo($tableRow);

    // Product Quantity
    $("<td>").text(productQuantity).appendTo($tableRow);

    // Product Carton Size
    const integerCartonSize = parseInt(productCartonSize.match(/\d+/)?.[0], 10) || null;    // Extracts number from string (e.g. Carton-44 turns to 44)
    $("<td>").text(integerCartonSize).appendTo($tableRow);

    // Unit Price
    $("<td>").text(`$${productPrice}`).appendTo($tableRow);

    // Total Price
    $("<td>").text(`$${(productQuantity * productPrice).toFixed(2)} (${productQuantity} * $${productPrice})`);

});