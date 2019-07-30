var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "amazon_db"
});

connection.connect(function (err, res) {
    if (err) throw err;
    console.log(`--------------------------------`);
    console.log(`Connected to: ${connection.config.database}`);
    console.log(`--------------------------------`);
    startazon();
});

function startazon() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res, ["item_id", "product_name", "price"]);
        inquirer.prompt([
            {
                type: "number",
                message: "Which product by Item ID# would you like to purchase?",
                name: "itemSelect"
            },
            {
                type: "number",
                message: `How many would you like to buy?`,
                name: "desiredQuantity"
            }
        ]).then(function (answers) {
            // get item_id 's stock_quantity value
            var chosenItem = res.filter(each => each.item_id === answers.itemSelect)
            // console.table(chosenItem);
            if (answers.desiredQuantity <= chosenItem[0].stock_quantity) {
                // console.log(`Inventory available for purchase.`)
                var newQuantity = chosenItem[0].stock_quantity - answers.desiredQuantity;
                var newTotalCost = answers.desiredQuantity * chosenItem[0].price
                connection.query(
                    "UPDATE products SET ? WHERE ?", [{ stock_quantity: newQuantity }, { item_id: answers.itemSelect }],
                    function (err, result) {
                        if (err) throw err;
                        console.log(`Order Processed. You purchased ${answers.desiredQuantity} ${chosenItem[0].product_name} and were charged $${newTotalCost.toFixed(2)}`);
                        connection.end();
                    }
                )
            } else {
                console.log(`Insufficient quantity!`)
                connection.end();
            }
        })
    });
}