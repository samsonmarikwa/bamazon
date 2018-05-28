require('dotenv').config();

var mysql = require("mysql"); // connect to mysql
var table = require('easy-table'); // to display well layout tabular console logs
var inquirer = require("inquirer");

// create the connection information for the sql dtabase
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.DB_PASSWD,
    database: "bamazon"
});

// connect to the mysql server and database
connection.connect(function(err) {
    if (err) throw err;
    // run the function to access data
    displayItems(true, "");
});

var displayItems = function(buying, ItemCode) {

    // construct a SQL statement for SELECT
    var stmt = "SELECT * FROM products WHERE item_id LIKE '" + ItemCode + "%'";

    connection.query(stmt, function(err, results) {

        //   connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;

        // create table instance to print
        var tab = new table;

        // populate table with data from the query result
        for (var x = 0; x < results.length; x++) {
            tab.cell("Item Code", results[x].item_id);
            tab.cell("Description", results[x].product_name);
            tab.cell("Dept. Name", results[x].department_name);
            tab.cell("Price", results[x].price, table.number(2));
            tab.cell("Quantity", results[x].stock_quantity, table.number(3));
            tab.newRow();
        }

        console.log(tab.toString());
        console.log("\n\n");

        if (buying) {
            askProductToBuy();
        }

    });
}

var askProductToBuy = function() {

    var questions = [{
        type: "input",
        message: "Enter the product code you want to buy or X to Exit",
        name: "selection",
        validate: function(value) {
            if (value.toUpperCase() === "X" || (value >= "1000" && value <= "9999")) {
                return true;
            } else {
                return "Please enter a valid product code or X to Exit";
            }
        }

    }];

    inquirer.prompt(questions).then(function(answers) {
        if (answers.selection.toUpperCase() != "X") {
            askProductQty(answers.selection);
        } else {
            console.log("\n");
        }
    });
}

var askProductQty = function(itemCode) {

    var questions = [{
        type: "input",
        message: "Enter quantity you want to buy",
        name: "quantity",
        validate: function(value) {
            if (isNumeric(value)) {
                return true;
            } else {
                return "Please enter a valid number";
            }
        }
    }];

    inquirer.prompt(questions).then(function(answers) {
        placeOrder(itemCode, parseFloat(answers.quantity));
    });
}

var placeOrder = function(item, qty) {
    // first check if item quantity can satisfy order
    connection.query("SELECT * FROM products WHERE ?", [{
        item_id: item
    }], function(err, results) {
        if (err) throw err;

        var updateQty = 0;

        if (results.length > 0) {

            for (var x = 0; x < results.length; x++) {
                updateQty = results[x].stock_quantity;
            }

            if (updateQty >= qty) {
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: updateQty - qty
                }, {
                    item_id: item
                }], function(err, res) {
                    if (err) throw err;
                    console.log("\n" + res.affectedRows + " product(s) updated!\n\n");
                    displayItems(false, item);
                });
            } else {
                console.log("\nInsufficient quantity available!\n\n");
            }

        } else {
            console.log("\nProduct Code: " + item + " Not Found!\n\n");
        }
    });
}

// function checks if the parameter is a number
var isNumeric = function(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
}