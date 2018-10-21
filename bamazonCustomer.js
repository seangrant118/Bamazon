const mysql = require("mysql");
var inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",

  port: 3306,

  user: "root",

  // be sure to enter your own password before running
  password: "password",
  database: "bamazon_db"
});

// connect to mysql server and database

connection.connect(function (err) {
  if (err) throw err;

  start();
})

// function to start the application

function start() {
  inquirer
    .prompt([{
        name: "productID",
        type: "input",
        message: "Please enter the product ID of the item you wish to buy",
        validate: function (value) {
          if (!isNaN(value) && value > 0 && value <= 10) {
            return true;
          } else
            return false;
        }
      },
      {
        name: "quantity",
        type: "input",
        message: "How many would you like to purchase?",
        validate: function (value) {
          if (!isNaN(value)) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function (answer) {
      let selectedProduct;

      connection.query("SELECT * FROM products", function (err, results) {
        
        // find selected product in database
        for (let i = 0; i < results.length; i++) {
          if (results[i].item_id === answer.productID) {
            selectedProduct = results[i];
          }
        }
      })
      // check quantity of selected item
      if (selectedProduct.stock_quantity > parseInt(answer.quantity)) {

        // if enough in stock update db and inform customer of successful purchase
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [{
              quantity: quantity - answer.quantity
            },
            {
              item_id: selectedProduct.item_id
            }
          ],
          function (error) {
            if (error) throw error;
            console.log("Item successfully purchased!")
            start();
          }

        )

      } else {
        console.log("There are not enough in stock");
        start();
      }

    })
}