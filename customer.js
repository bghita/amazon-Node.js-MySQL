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

