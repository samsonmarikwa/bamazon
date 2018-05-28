-- Create the bamazon database
--
-- Delete the database if it exists
DROP DATABASE IF EXISTS bamazon;
-- Create the database
CREATE DATABASE bamazon;

-- Use the database before any operations can take place
USE bamazon;

-- Create the products table with item_id as a primary key
-- Primary key is auto-incrementing starting from 1000
CREATE TABLE products(
	item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(30) NOT NULL,
    department_name VARCHAR(30) NOT NULL,
    price INTEGER(10),
    stock_quantity INTEGER(5),
    PRIMARY KEY (item_id))
    AUTO_INCREMENT=1000;

-- Insert data into the table
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES("Copy & Print Paper","Stationery",5.00,20),
	("Keyboard and mouse","Hardware",15.00,15),
    ("Apple Laptop","Hardware",800,10),
    ("HP Laptop","Hardware",650,15),
    ("HP Laser printer","Hardware",65,20),
    ("Envelopes","Stationery",15.00,100),
    ("Ink catridges","Stationery",35.00,20),
    ("Laser catridges","Stationery",40.00,25),
    ("Writing pads","Stationery",3.00,100),
    ("Wirebound notebook","Stationery",3.50,90)
