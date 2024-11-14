let cart = new Map();
const viewCartButton = document.getElementById("viewCartButton");

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
            tableButton.textContent = "Add to Cart";
            tableButton.onclick = function() {
                if (tableButton.textContent.includes("Add"))
                {
                    // Add to cart
                    cart.set(indexedProduct["SKU"], [indexedProduct["Product Name"], 0])    // 0 at the end is for quantity purposes
                    tableButton.textContent = "Remove Cart";
                    tableButton.style.backgroundColor = "#525252";
                    console.log("Cart Updated: " + cart);

                } else {
                    // Remove from cart
                    cart.delete(indexedProduct["SKU"]);
                    tableButton.textContent = "Add to Cart";
                    tableButton.style.backgroundColor = "#4CAF50";
                    console.log(indexedProduct["Product Name"] + " is already in cart");
                }

                // update cart tally on button
                if (cart.size > 0)
                {
                    viewCartButton.textContent = "View Cart (" + cart.size + ")";
                } else {
                    viewCartButton.textContent = "View Cart" ;
                }
                
            }

            tableRow.appendChild(tableElementForButton);
            tableElementForButton.appendChild(tableButton);

        }

        // Reinitialize DataTables after adding rows
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