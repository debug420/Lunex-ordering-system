
const viewCartButton = document.getElementById("viewCartButton");
viewCartButton.onclick = function() {
    window.location.href = "cart.html";
}

// Visual functions for button coloring
function makeCartButtonRemove(buttonObject) {
    buttonObject.textContent = "Remove";
    buttonObject.style.backgroundColor = "#525252";
}

function makeCartButtonAdd(buttonObject) {
    buttonObject.textContent = "Add";
    buttonObject.style.backgroundColor = "#4CAF50";
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

    const lengthOfSessionStorage = sessionStorage.length
    let skuToRemoveFromSessionStorage = [];
    for (i = 0; i < lengthOfSessionStorage; i++) {
        if (isSKU(sessionStorage.key(i))) {
            skuToRemoveFromSessionStorage.push(sessionStorage.key(i));
        }
    }

    skuToRemoveFromSessionStorage.forEach(sku => {
        sessionStorage.removeItem(sku);
    });
    
    // Reset cart action buttons
    updateCartButtons();
    updateViewCartButton();

}

// Initialize product json file
let products = [];
fetch("products.json")
    .then(response => response.json())
    .then(data => {
        
        products = data;
        console.log("Data loaded...");

        // Populate list in HTML
        const mainTable = document.getElementById("mainTableBody");
        for (index in products) {

            const tableRow = document.createElement("tr");
            const indexedProduct = products[index];
            mainTable.appendChild(tableRow);

            const indexableElements = ["SKU", "Product Name", "Selling Price", "Brand"];
            for (let i = 0; i < 4; i++) {
                const tableElement = document.createElement("td");
                tableElement.textContent = indexedProduct[indexableElements[i]] || "-";
                tableRow.appendChild(tableElement);
            }

            const tableElementForButton = document.createElement("td"); // wrapped in td for alignment purposes
            const tableButton = document.createElement("button");

            tableButton.id = "addCartButton";   // styling purposes
            tableButton.textContent = "Add";
            tableButton.onclick = function() {
                if (tableButton.textContent.includes("Add"))
                {
                    // Add to cart
                    sessionStorage.setItem(indexedProduct["SKU"], JSON.stringify([indexedProduct["Product Name"], indexedProduct["variationID"], 1, indexedProduct["Selling Price"]]));
                    makeCartButtonRemove(tableButton);
                } else {
                    // Remove from cart
                    sessionStorage.removeItem(indexedProduct["SKU"]);
                    makeCartButtonAdd(tableButton);
                }

                // update cart tally on button
                updateViewCartButton();
                    
            }

            tableRow.appendChild(tableElementForButton);
            tableElementForButton.appendChild(tableButton);
            cartButtons.set(indexedProduct["SKU"], tableButton);

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

