import {getCartFromSessionStorage, setSessionStorageMap, getSessionStorageMap} from "./module.js";

const viewCartButton = document.getElementById("viewCartButton");
viewCartButton.onclick = function() {
    window.location.href = "cart.html";
}

function makeCartButtonRemove(buttonObject) {
    buttonObject.textContent = "Remove";
    buttonObject.style.backgroundColor = "#525252";
}

function makeCartButtonAdd(buttonObject) {
    buttonObject.textContent = "Add";
    buttonObject.style.backgroundColor = "#4CAF50";
}

function updateViewCartButton() {
    if (getCartFromSessionStorage().size > 0) {
        viewCartButton.textContent = "View Cart (" + getCartFromSessionStorage().size + ")";
    } else {
        viewCartButton.textContent = "View Cart" ;
    }
}

let cartButtons = new Map();
function updateCartButtons() {
    cartButtons.forEach((buttonObject, SKU) => {
        if (sessionStorage.getItem(SKU)) {
            makeCartButtonRemove(buttonObject);
        } else {
            makeCartButtonAdd(buttonObject);
        }
    });
}

const resetCartButton = document.getElementById("resetCartButton");
resetCartButton.onclick = function() {

    getCartFromSessionStorage().forEach((productData, productSKU) => {
        sessionStorage.removeItem(productSKU);
    })
    
    // Reset cart action buttons
    updateCartButtons();
    updateViewCartButton();

}

// Initialize product json file

fetch("products.json")
    .then(response => response.json())
    .then(products => {
        
        console.log("Data loaded...");

        // Populate list in HTML
        const mainTable = document.getElementById("mainTableBody");
        for (let index in products) {

            const tableRow = document.createElement("tr");
            mainTable.appendChild(tableRow);
            
            let indexedProductData = new Map(Object.entries(products[index]));
            indexedProductData.set("Quantity", 1);

            indexedProductData.forEach((indexedValue, indexedElement) => {
                if (indexedElement != "ID" & indexedElement != "Quantity") {
                    const tableElement = document.createElement("td");
                    tableElement.textContent = indexedProductData.get(indexedElement) || "-";
                    tableRow.appendChild(tableElement);
                }
            })

            const tableElementForButton = document.createElement("td"); // wrapped in td for alignment purposes
            const tableButton = document.createElement("button");

            tableButton.id = "addCartButton";   // styling purposes
            tableButton.textContent = "Add";
            tableButton.onclick = function() {
                
                if (tableButton.textContent.includes("Add"))
                {
                    setSessionStorageMap(indexedProductData.get("SKU"), indexedProductData);
                    makeCartButtonRemove(tableButton);

                } else {

                    // Remove from cart
                    sessionStorage.removeItem(indexedProductData.get("SKU"));
                    makeCartButtonAdd(tableButton);

                }

                // update cart tally on button
                updateViewCartButton();
                    
            }

            tableRow.appendChild(tableElementForButton);
            tableElementForButton.appendChild(tableButton);
            cartButtons.set(indexedProductData.get("SKU"), tableButton);
        }

        updateCartButtons();
        updateViewCartButton();

        // Initialize DataTables after adding rows
        new DataTable("#mainTable", {
            columnDefs: [{
              "defaultContent": "",
              "targets": "_all"
            }],
            "oLanguage": {
               "sInfo" : "Displaying _START_ to _END_ of _TOTAL_",
               "sLengthMenu" : "_MENU_"
            }
        });

    })
    .catch(error => console.error("Error loading table:", error))