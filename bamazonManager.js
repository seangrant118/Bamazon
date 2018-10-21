const mysql = require("mysql");
const inquirer = require("inquirer");

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

// function to start prompt
function start() {
  inquirer
    .prompt({
      name: "managerPrompt",
      type: "list",
      message: "What would you like to do?",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    })
    .then(function(answer) {

      // switch case to run function according to selection
      switch(answer.managerPrompt) {
        case "View Products for Sale":
          view()
          break;
        case "View Low Inventory":
          lowInventory()
          break;
        case "Add to Inventory":
          add()
          break;
        case "Add New Product":
          newProduct()
          break;
      }
    })
}

// function to view products for sale
function view() {
  connection.query("SELECT * FROM products", function(err, results) {
    for (let i = 0; i < results.length; i++) {
      console.log(`
      Product id: ${results[i].item_id}
      Product Name: ${results[i].product_name}
      Department: ${results[i].department_name}
      Price: ${results[i].price}
      Quantity: ${results[i].stock_quantity}`)
    }
    start();
  })
}

// function to view low inventory
function lowInventory() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;
    for (let i = 0; i < results.length; i++) {
      if (results[i].stock_quantity < 5) {
        console.log(`
        LOW QUANTITY:
        Product Name: ${results[i].product_name}
        Quantity: ${results[i].stock_quantity}`)
      }
      start();
    }
  })
}