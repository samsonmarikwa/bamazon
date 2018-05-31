// load sensitive environmental data from .env file
require('dotenv').config();

var mysql = require("mysql"); // load mysql driver
// var ctable = require('console.table'); // to display well layout tabular console logs. Easy to use but does not allow formatting of columns.
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
 * List of menu options
 */
var displayMenu = function() {

    console.log("\n");

    var questions = [{
        type: "list",
        message: "Select Menu Option",
        choices: ["View Product Sales by Department", "Create New Department", "Exit"],
        name: "selection"
    }];

    inquirer.prompt(questions).then(function(answers) {
        switch (answers.selection) {
            case "View Product Sales by Department":
                {
                    console.log("\nViewing Product Sales by Department\n");
                    viewProductSales();
                    break;
                }
            case "Create New Department":
                {
                    console.log("\nCreate New Department\n");
                    createDept();
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

var viewProductSales = function() {
    var stmt = "SELECT p.dept_id, d.dept_name, over_head_costs, product_sales, product_sales - over_head_costs AS total_profit   FROM products AS p, departments AS d WHERE p.dept_id = d.dept_id GROUP BY p.dept_id";

    connection.query(stmt, function(err, results) {

        if (err) throw err;

        // This is from console.table. Easy to use but lacks formatting ability
        // var table = ctable.getTable(results);
        // console.log(table);

        // create table instance to print
        var tab = new table;

        // populate table with data from the query result
        for (var x = 0; x < results.length; x++) {
            tab.cell("Dept. Id", results[x].dept_id);
            tab.cell("Department Name", results[x].dept_name);
            tab.cell("Overhead Costs", results[x].over_head_costs, table.number(2));
            tab.cell("Product Sales", results[x].product_sales, table.number(2));
            tab.cell("Total Profit", results[x].total_profit, table.number(2));
            tab.newRow();
        }

        console.log(tab.toString());

        console.log("\n\n--- End of Report ---\n\n");
        displayMenu();
    });
}

var createDept = function() {

    var questions = [{
        type: "input",
        message: "Department Name: ",
        name: "deptName"
    }, {
        type: "input",
        message: "Overhead Costs: ",
        name: "overheadCosts",
        validate: function(value) {
            if (isNumeric(value)) {
                return true;
            } else {
                return "Please enter a valid number";
            }
        }
    }];

    inquirer.prompt(questions).then(function(answers) {
        addNewDept(answers.deptName, answers.overheadCosts);
    });
}

var addNewDept = function(name, costs) {
    connection.query("INSERT INTO departments SET ?", {
        dept_name: name,
        over_head_costs: costs
    }, function(err, res) {
        console.log("\n" + res.affectedRows + " department inserted!\n\n");
        viewDepartments();
    });
}


var viewDepartments = function() {
    var stmt = "SELECT dept_id, dept_name, over_head_costs FROM departments";

    connection.query(stmt, function(err, results) {

        if (err) throw err;

        // create table instance to print
        var tab = new table;

        // populate table with data from the query result
        for (var x = 0; x < results.length; x++) {
            tab.cell("Dept. Id", results[x].dept_id);
            tab.cell("Department Name", results[x].dept_name);
            tab.cell("Overhead Costs", results[x].over_head_costs, table.number(2));
            tab.newRow();
        }

        console.log(tab.toString());

        console.log("\n\n--- End of Report ---\n\n");
        displayMenu();
    });
}


// function checks if the parameter is a number
var isNumeric = function(num) {
    return !isNaN(parseFloat(num)) && isFinite(num);
}