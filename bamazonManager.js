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

// function to add more inventory
function add() {
  connection.query("SELECT * FROM products", function(err, results) {
    if (err) throw err;

    // prompt which product you'd like more inventory added to
    inquirer
      .prompt([
        {
          name: "addInventory",
          type: "list",
          message: "Which product would you like to add inventory for?",
          choices: function() {
            let choiceArray = [];
            for (let i = 0; i < results.length; i++) {
              choiceArray.push(results[i].product_name);
            }
            return choiceArray;
          }
        },
        {
          name: "addQuantity",
          type: "input",
          message: "How many would you like to add?",
          validate: function(value) {
            if (!isNaN(value)) {
              return true;
            }
            return false;

          }
        }
      ])
      .then(function(answer) {

        // select item from the table
        let selected;
        for (let i = 0; i < results.length; i++) {
          if (results[i].product_name === answer.addInventory) {
            selected = results[i]
          }
        }

        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              // add new inventory to old stock quantity
              stock_quantity: parseInt(answer.addQuantity) + parseInt(selected.stock_quantity)
            },
            {
              product_name: answer.addInventory
            }
          ],
          function(error) {
            if (error) throw error;
            console.log("UPDATED");
            start();
          }
        )
      })
  })
}

function newProduct() {
  // prompt for new product information
  inquirer
    .prompt([
      {
        name: "productName",
        type: "input",
        message: "What item would you like to add?"
      },
      {
        name: "departmentName",
        type: "input",
        message: "What department will you assign it to?"
      },
      {
        name: "price",
        type: "input",
        message: "What is the product's price?",
        validate: function(value) {
          if (!isNaN(value)) {
            return true;
          }
          return false;
        }
      },
      {
        name: "quantity",
        type: "input",
        message: "How many units?",
        validate: function(value) {
          if (!isNaN(value)) {
            return true;
          }
          return false;
        }
      }
    ])
    .then(function(answer) {
      // inserting the new product into the database
      connection.query(
        "INSERT INTO products SET?",
        {
          product_name: answer.productName,
          department_name: answer.departmentName,
          price: answer.price,
          stock_quantity: answer.quantity
        },
        function(error) {
          if (error) throw error;
          console.log("New Product added");
          start();
        }
      )
    })
}