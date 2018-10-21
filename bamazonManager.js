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

function start() {
  inquirer
    .prompt({
      name: "managerPrompt",
      type: "list",
      message: "What would you like to do?",
      choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    })
    .then(function(answer) {
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