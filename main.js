import { getCartFromSessionStorage, setSessionStorageMap, getSessionStorageMap } from "./module.js";

const $viewCartButton = $("#viewCartButton");
$viewCartButton.on("click", () => {
    window.location.href = "cart.html";
});

function makeCartButtonRemove($button) {
    $button.text("Remove").css("background-color", "#525252");
}

function makeCartButtonAdd($button) {
    $button.text("Add").css("background-color", "#4CAF50");
}

function updateViewCartButton() {
    const cartSize = getCartFromSessionStorage().size;
    $viewCartButton.text(cartSize > 0 ? `View Cart (${cartSize})` : "View Cart");
}

const cartButtons = new Map();

function updateCartButtons() {
    cartButtons.forEach(($button, SKU) => {
        if (sessionStorage.getItem(SKU)) {
            makeCartButtonRemove($button);
        } else {
            makeCartButtonAdd($button);
        }
    });
}

const $resetCartButton = $("#resetCartButton");
$resetCartButton.on("click", () => {
    getCartFromSessionStorage().forEach((_, productSKU) => {
        sessionStorage.removeItem(productSKU);
    });

    updateCartButtons();
    updateViewCartButton();
});

fetch("products.json")
    .then(response => response.json())
    .then(products => {
        console.log("Data loaded...");

        const $mainTableBody = $("#mainTableBody");
        products.forEach(product => {
            const $tableRow = $("<tr>");
            $mainTableBody.append($tableRow);

            let indexedProductData = new Map(Object.entries(product));
            indexedProductData.set("Quantity", 1);

            indexedProductData.forEach((value, key) => {
                if (key !== "ID" && key !== "Quantity") {
                    const $tableCell = $("<td>").text(value || "-");
                    $tableRow.append($tableCell);
                }
            });

            const $tableCellForButton = $("<td>");
            const $tableButton = $("<button>")
                .attr("id", "addCartButton")
                .text("Add")
                .on("click", function () {
                    if ($tableButton.text().includes("Add")) {
                        setSessionStorageMap(indexedProductData.get("SKU"), indexedProductData);
                        makeCartButtonRemove($tableButton);
                    } else {
                        sessionStorage.removeItem(indexedProductData.get("SKU"));
                        makeCartButtonAdd($tableButton);
                    }
                    updateViewCartButton();
                });

            $tableCellForButton.append($tableButton);
            $tableRow.append($tableCellForButton);

            cartButtons.set(indexedProductData.get("SKU"), $tableButton);
        });

        updateCartButtons();
        updateViewCartButton();

        // Initialize DataTables after adding rows
        new DataTable("#mainTable", {
            columnDefs: [
                {
                    defaultContent: "",
                    targets: "_all",
                },
            ],
            oLanguage: {
                sInfo: "Displaying _START_ to _END_ of _TOTAL_",
                sLengthMenu: "_MENU_",
            },
        });
    })
    .catch(error => console.error("Error loading table:", error));
