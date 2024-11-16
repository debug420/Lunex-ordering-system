const fs = require("fs");
let newData = [];
fs.readFile("ORIGINALDATA.json", function(err, data) {
    if (err) throw err;
    const parsedData = JSON.parse(data)["data"];
    parsedData.forEach(index => {
        let productMap = new Map();
        productMap.set("SKU", index["sku"]);
        productMap.set("Product Name", index["product"].replace(/<span[^>]*>.*?<\/span>/gi, ''));
        productMap.set("Selling Price", parseFloat(index["min_price"] || index["max_price"]).toFixed(2));
        productMap.set("Brand", index["brand"] || "-");
        productMap.set("variationID", index["id"]);
        newData.push(Object.fromEntries(productMap));
    });

    fs.writeFile("./NEWDATA.json", JSON.stringify(newData), err => {
        if (err) {
            console.log(err);
        } else {
            console.log("Parsed data successfully");
        }
    });

})

