let cart = [];
let clickedSKUs = [];

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
                tableElement.textContent = indexedProduct[indexableElements[i]];
                if (tableElement.textContent == "" ){
                    tableElement.textContent = "-";
                }
                tableRow.appendChild(tableElement);
            }

            const tableButton = document.createElement("button");
            tableButton.id = "addCartButton";
            tableButton.textContent = "Add to Cart";
            tableButton.onclick = function() {
                if (!clickedSKUs.includes(indexedProduct["SKU"]))
                {
                    cart.push([indexedProduct["SKU"], indexedProduct["Product Name"]]);
                    clickedSKUs.push(indexedProduct["SKU"]);
                    tableButton.style.backgroundColor = "#525252";
                    console.log("Cart Updated: " + cart);
                } else {
                    console.log(indexedProduct["Product Name"] + " is already in cart");
                }
            }
            tableRow.appendChild(tableButton);

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