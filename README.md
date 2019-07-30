# amazon-Node.js-MySQL

This node application is for consumers to enter and manage inventory for sales purposes on both customer and manager ends. It provides a menu to help direct user needs and updates through a mysql database. This app uses the inquirer and mysql npm packages for both apps and references the same mysql database. Find database info in the schema.sql file. The customer app provides a list of all products and prices, and then asks how many they would like to purchase. If there is not enough inventory for a large order, then it responds with "Insufficient Quantity!"

To use the customer app, open the corresponding folder in your terminal, and then begin the process by typing "node customer.js". Once the app loads, read the data in the table that displays and enter in a product id# to select it for purchase, then enter how many of the product you would like to buy. If there is enough inventory the app will either process the order order return an insuffient quantity message. The database will be updated with a reduced number of products should the request go through.

Then for the manager app, open the corresponding folder in your terminal, and then begin the process by typing "node manager.js". Once the app loads, the user is prompted with 5 options.

1.View Products for Sale
2.View Low Inventory
3.Add to Inventory
4.Add New Product
5.Exit

Option 1 & 2 
Will open a table or series of tables will load showing a ever product for sale or just those products with less than 30 in inventory.

Option 3 & 4 
Will return a prompt asking for information to either increase the amount of product in inventory or add a new product all together. Once completed, the database will be updated with an increased number of existing products or new products.
