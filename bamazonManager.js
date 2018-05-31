// load sensitive environmental data from .env file
require('dotenv').config();

var mysql = require("mysql"); // load mysql driver
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
    console.log("\n\n\n");
    // display menu options
    displayMenu();
});


/*
 * List a set of menu options
 */
var displayMenu = function() {

    console.log("\n");

    var questions = [{
        type: "list",
        message: "Select Menu Option",
        choices: ["View Products For Sale", "View Low Inventory", "Add To Inventory", "Add New Product", "Exit"],
        name: "selection"
    }];

    inquirer.prompt(questions).then(function(answer) {
        switch (answer.selection) {
            case "View Products For Sale":
                {
                    console.log("\nViewing products\n");
                    viewProducts(false, "", "all");
                    break;
                }
            case "View Low Inventory":
                {
                    console.log("\nViewing Low Inventory\n");
                    viewProducts(false, "", "low");
                    break;
                }
            case "Add To Inventory":
                {
                    console.log("\nAdding To Inventory\n");
                    viewProducts(true, "", "all");;
                    break;
                }
            case "Add New Product":
                {
                    console.log("\nAdding New Product\n");
                    addNewProduct();
                    break;
                }
            case "Exit":
                {
                    console.log("\nExiting\n");
                    connection.end();
                    break;
                }
        }
    });

}


/*
 * view products
 * -- Parameters --
 * buying   - will determine if askProduct to buy will run. In some instances, we just
 *            want to run the function to display products without buying them.
 * itemCode - determines the item_id to be selected in the database SELECT statement.
 *            We need this to run the viewProducts to display the item that was updated.
 * productRange - low executes viewProducts for those that are below the quanity of 5
 */
var viewProducts = function(addStock, itemCode, productRange) {

    // construct a SQL statement for SELECT
    if (productRange === "low") {
        var stmt = "SELECT * FROM products AS p, departments AS d WHERE stock_quantity < 5 AND p.dept_id = d.dept_id";
        //  var stmt = "SELECT item_id, product_name, p.dept_id, dept_name, price, stock_quantity FROM products AS p, departments AS d WHERE stock_quantity < 5 AND p.dept_id = d.dept_id";
    } else {
        var stmt = "SELECT * FROM products AS p, departments AS d WHERE item_id LIKE '" + itemCode + "%' AND p.dept_id = d.dept_id";
        //   var stmt = "SELECT item_id, product_name, p.dept_id, dept_name, price, stock_quantity FROM products AS p, departments AS d WHERE item_id LIKE '" + itemCode + "%' AND p.dept_id = d.dept_id";
    }

    connection.query(stmt, function(err, results) {

        if (err) throw err;

        // create table instance to print
        var tab = new table;

        // populate table with data from the query result
        for (var x = 0; x < results.length; x++) {
            tab.cell("Item Code", results[x].item_id);
            tab.cell("Description", results[x].product_name);
            tab.cell("Dept. ID", results[x].dept_id);
            tab.cell("Department Name", results[x].dept_name);
            tab.cell("Price", results[x].price, table.number(2));
            tab.cell("Quantity", results[x].stock_quantity, table.number(3));
            tab.newRow();
        }

        console.log(tab.toString());
        console.log("\n\n--- End of Report ---\n\n");
        if (addStock) {
            addInventory();
        } else {
            if (productRange === "low") {
                if (results.length < 1) {
                    console.log("\n\nThere are no items below minimum quantity of 5...\n\n");
                }
            }
            displayMenu();
        }

    });

}

var addInventory = function() {

    var questions = [{
        type: "input",
        message: "Enter the product code you want to replenish or X to Exit: ",
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
        message: "Enter quantity you want to replenish: ",
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

            connection.query("UPDATE products SET ? WHERE ?", [{
                stock_quantity: updateQty + qty
            }, {
                item_id: item
            }], function(err, res) {
                if (err) throw err;
                console.log("\n" + res.affectedRows + " product(s) updated!\n\n");
                viewProducts(false, item, "all");
            });

        } else {
            console.log("\nProduct Code: " + item + " Not Found! Please enter an existing product.\n\n");
            viewProducts(false, item, "all");
        }
    });
}


var addNewProduct = function() {

    var questions = [{
        type: "input",
        message: "Enter product description: ",
        name: "prodName"
    }, {
        type: "input",
        message: "Enter department id: ",
        name: "prodDept"
    }, {
        type: "input",
        message: "Enter unit price: ",
        name: "prodPrice",
        validate: function(value) {
            if (isNumeric(value)) {
                return true;
            } else {
                return "Please enter a valid number";
            }
        }
    }];

    inquirer.prompt(questions).then(function(answers) {
        createProductRecord(answers.prodName, answers.prodDept, answers.prodPrice);
    });
}


// function checks if the parameter is a number
var isNumeric = function(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
}

var createProductRecord = function(name, dept, price) {
    connection.query("INSERT INTO products SET ?", {
        product_name: name,
        dept_id: dept,
        price: price
    }, function(err, res) {
        if (err) {
            console.log("Error creating record! Invalid dept_id: " + dept);
            console.log("\n" + err.sqlMessage + "\n\n");
        } else {
            console.log("\n" + res.affectedRows + " product inserted!\n\n");
        }

        viewProducts(false, "", "all");
    });
}