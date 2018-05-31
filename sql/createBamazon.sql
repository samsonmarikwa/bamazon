-- Create the bamazon database
--
-- Delete the database if it exists
DROP DATABASE IF EXISTS bamazon;

-- Create the database
CREATE DATABASE bamazon;

-- Use the database before any operations can take place
USE bamazon;

-- delete the table if it exists
DROP TABLE IF EXISTS departments;

-- create the table
CREATE TABLE departments(
	dept_id INT(3) NOT NULL AUTO_INCREMENT,
    dept_name VARCHAR(20) NOT NULL,
    over_head_costs DECIMAL(8,2),
    PRIMARY KEY(dept_id))
    AUTO_INCREMENT=100;

-- delete table if it exists
DROP TABLE IF EXISTS products;

-- Create the products table with item_id as a primary key
-- Primary key is auto-incrementing starting from 1000
CREATE TABLE products(
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(30) NOT NULL,
    dept_id INT(3) NOT NULL REFERENCES departments(dept_id),
    price DECIMAL(8,2),
    stock_quantity INTEGER(5),
    product_sales DECIMAL(8,2),
    PRIMARY KEY (item_id))
    AUTO_INCREMENT=1000;

-- add a foreign key constraint to ensure only valid dept_id are created in the products table
ALTER TABLE products
ADD CONSTRAINT FK_ProductsDepartment
FOREIGN KEY (dept_id) REFERENCES departments(dept_id);

-- populate the Ddepartments table with initial data
INSERT INTO departments(dept_name,over_head_costs)
VALUES("Stationery",1000.00),
		("Hardware",1500),
        ("Electronics",1250.55),
        ("Clothing and Shoes",780.99);
    
-- Insert data into the products table
INSERT INTO products (product_name, dept_id, price, stock_quantity)
VALUES("Copy & Print Paper",100,5.00,20),
	("Keyboard and mouse",101,15.00,15),
    ("Apple Laptop",101,800,10),
    ("HP Laptop",101,650,15),
    ("HP Laser printer",101,65,20),
    ("Envelopes",100,15.00,100),
    ("Ink catridges",100,35.00,20),
    ("Laser catridges",100,40.00,25),
    ("Writing pads",100,3.00,100),
    ("Wirebound notebook",100,3.50,90),
    ("LG Smart TV",102,250.59,15);
