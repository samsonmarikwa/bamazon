# Bamazon Storefront


## Application description
Bamazon Storefront is a command line application that uses node.js and MySQL. Three programs make up the Bamazon application, which are bamazonCustomer.js, bamazonManager.js and bamazonSupervisor.js. Four packages were installed from npmjs namely dotenv to load environmental variables to the process.env object in node, MySQL which is the MySQL database driver for node.js, Easy-table which is a utility for rendering text tables with javascript and lastly the Inquirer package to provide a user interface and session flow for the user to interact with the application.


## Setup
To use this application, a user will be required to create a database in MySQL using the script in the folder sql. The script name is createBamazon.sql. The user is then required to create a .env file with a password to access the created MySQL database.


## Functionality
The bamazonCustomer allows a customer to place orders in the system. Some data validation takes place in the program using Inquirer.


The bamazonManager allows a manager to access the application to check on inventory that is available for sale, inventory below minimum level and to add new products and replenish stocks.


The bamazonSupervisor allows a supervisor to get a report on sales and to create new departments.


## Further information
Further information on how to setup and use the system is available on 
[Application Demo Videos](https://drive.google.com/drive/folders/1AvKI0r8PcrNBCIans32TF9Znfu0pP-Ht?usp=sharing)

