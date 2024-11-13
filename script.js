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
        }

        // Reinitialize DataTables after adding rows
        new DataTable("#mainTable");

    })
    .catch(error => console.error("Error loading table:", error))