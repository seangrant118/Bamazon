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
      connection.query("SELECT * FROM products", function (err, results) {

        // get info from database

        let selected = results;

        for (var i = 0; i < results.length; i++) {
          if (results[i].item_id === answer.productID) {
            selected = results[i];
          } 
        }

        // check quantity in database
        if (selected.stock_quantity >= answer.quantity) {
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [{
                stock_quantity: selected.stock_quantity - answer.quantity
              },
              {
                item_id: selected.item_id
              }
            ],
            function (error) {
              if (error) throw err;
              console.log("Successful Purchase!");
              start();
            }
          )
        }
      })
    })
}