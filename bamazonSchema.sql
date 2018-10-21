DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY(item_id)
);

INSERT INTO products
  (product_name, department_name, price, stock_quantity)
VALUES
  ("Soap", "Cosmetics", 2.50, 100),
  ("Shampoo", "Cosmetics", 3.99, 175),
  ("Basketball", "Sports", 12.00, 30),
  ("Scooter", "Sports", 139.99, 12),
  ("Lettuce", "Produce", 0.75, 100),
  ("Chicken", "Produce", 5.99, 25),
  ("Donnie Darko DVD", "Entertainment", 9.99, 2),
  ("PlayStation 4", "Entertainment", 399.99, 6),
  ("Microwave", "Appliances", 74.99, 9),
  ("Washing Machine", "Appliances", 1200.00, 4);

  SELECT * FROM products;