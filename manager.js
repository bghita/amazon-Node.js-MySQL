const mysql = require("mysql");

const inquirer = require("inquirer");

const connection = mysql.createConnection({
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

const products = function(cb) {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        let prodArr = [];
        let quantArr = [];
        for (let i = 0; i < res.length; i++) {
            prodArr.push(res[i].item_id + " " + res[i].product_name)
            quantArr.push(res[i].stock_quantity)
        }
        cb(prodArr)
    })
}

function startazon() {
    inquirer.prompt([
        {
            type: "list",
            name: "menu",
            message: "What would you like to do?",
            choices: ["View Products for Sale","View Low Inventory (below 30)","Change Inventory Levels","Add New Product","Exit"]
        }
    ]).then(function(sel){
        if(sel.menu === "View Products for Sale") {
            viewProd();
        }
        if(sel.menu === "View Low Inventory (below 30)") {
            viewLowInv();
        }
        if(sel.menu === "Change Inventory Levels") {
            changeInv();
        }
        if(sel.menu === "Add New Product") {
            addNewProd();
        }
        if(sel.menu === "Exit") {
            connection.end();
        }
    })
};

const viewProd = function() {
    console.log("View All Products: ")
    console.log("-------------------------------------------")
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.table(res, ["item_id", "product_name", "price", "stock_quantity"]);
        connection.end();
    })
    console.log("-------------------------------------------")
}

const viewLowInv = function() {
    console.log("Products With Low Inventory (below 30): ")
    console.log("-------------------------------------------")
    connection.query("SELECT product_name, stock_quantity FROM products", function(err, res) {
        if (err) throw err;
        // console.log(res);
        let lowCheck = false;
        // console.log(res[0].stock_quantity)
        for (let i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 30) {
                console.table(res[i]);
                lowCheck = true;
            }
        }
        if (lowCheck === false) { 
            console.log("No products are below 30 in stock quantity.")
        }
        connection.end();
    })

};

const changeInv = function() {
    
    //Invokes products function ahead of inquirer due to async load for use in list choices.  
    products(function(data){
        console.log(data);
        inquirer.prompt([
            {
                type: "list",
                name: "addInventory",
                message: "Which product would you like to add/remove inventory?",
                choices: data
            },
            {
                type: "number",
                message: "How much would you like to add/remove?",
                name: "numInventory",
            }
        ]).then(function(prod){
            // Values from above inquirer
            const prodId = prod.addInventory.split(" ")[0];
            var wordLength = prod.addInventory.split(" ").length;
            let invType = prod.addInventory.split(" ").slice(1, wordLength);
            var invTypeStr = invType.join(" ");
            let prodNum = prod.numInventory;

            connection.query(
                // Querying all products where...
                "SELECT * FROM products WHERE ?", 
                // Product name === the product just selected in the above inquirer
                {item_id: prodId}, 
                function(err, res)    
            {
                if (err) throw err;
                // console.log(res);
                var productResult = res[0];
                console.log("Updating Inventory...");
                console.log("-------------------------------------------")
                connection.query(
                    // Updating the products table, specifically the amount of inventory for ...
                    `UPDATE products SET stock_quantity = ? WHERE ?`,
                    // Array of 2 for the 2 ?s above. 1. Old num + num in inquirer in parentheses & 2. showing key: value in object form for matching and updating  
                    [(productResult.stock_quantity + prodNum), {product_name: invTypeStr}],
                    function(err, total) 
                {
                    var newProdTotal = total[0];
                    if(err) throw err
                    console.log(`${prodNum} added to ${invType} for a new total of ${productResult.stock_quantity + prodNum}.`);
                    console.log("-------------------------------------------")
                    connection.end();
                })
            })
        })
    })
}

const addNewProd = function() {

    inquirer.prompt([
        {
            type: "input",
            name: "product_name",
            message: "Which product would you like to add?"
        },
        {
            type: "linputist",
            name: "department_name",
            message: "Which department would you like this product to be placed in?"
        },
        {
            type: "number",
            name: "price",
            message: "How much would like to list the price of the new product? $"
        },
        {
            type: "number",
            name: "stock_quantity",
            message: "How many would you like to add to inventory?"
        }
    ]).then(function(newInv){

        connection.query(
            // INSERT INTO products table, where we SET values...
            `INSERT INTO products SET ?`,
            // newInv is my pass through function variable that after matching the names of each of the inquirer values to the names of the actual products key names, get dynamically updated.
            newInv,
            function(err, res) 
            
        {

            if(err) throw err
            console.log("-------------------------------------------")
            console.log("A new product has been entered into the system!");
            console.log("-------------------------------------------")

            connection.end();
        })
    })
}