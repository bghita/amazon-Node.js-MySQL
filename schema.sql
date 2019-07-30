DROP DATABASE IF EXISTS amazon_db;

CREATE DATABASE amazon_db;

USE amazon_db;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(150) NULL,
department_name VARCHAR(150) NULL,
price DECIMAL(10,2) NULL,
stock_quantity INT(10) NULL,
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Top Hat", "Hats", 74.99, 25),
("Baseball Cap", "Hats", 24.99, 100),
("Visor", "Hats", 12.99, 94),
("Fisherman's Hat", "Hats", 18.25, 45),
("Bowler", "Hats", 52.49, 25),
("Running Shoes", "Shoes", 99.99, 55),
("Basketball Shoes", "Shoes", 74.99, 70),
("Tennis Shoes", "Shoes", 34.99, 35),
("Cross-Trainers", "Shoes", 50, 85),
("Rain Boots", "Shoes", 85, 25),
("Sandals", "Shoes", 20, 150);

SELECT * FROM products;