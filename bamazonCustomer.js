const mysql = require("mysql");
const inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  database: "bamazon_db"
});

connection.connect((error) => {
  if (error) {
    throw error;
  }
  // console.log("Connected as id: " + connection.threadId);
  stockStore();
});

function stockStore () {
  console.log("\n\nWELCOME TO BAMAZON!\n----------------------\nA site for unique & unrelated items you didn't know you needed.\n----------------------\n\nSHOP the following products:\n");

  connection.query("SELECT * FROM products", (error, response) => {
      if (error) {
        throw error;
        console.log ("Hmm...looks like we have some stocking issues. Please come back later!")
      }

      response.forEach(products => {
        console.log(products.id + " - " + products.product_name + "\nPrice: $" + products.price + "\n" + products.department_name + " | ID#: " 
              + products.item_id + "\n");
      });   
    buyItem();  
  });
};

function buyItem() {

  console.log("----------------------\nCART & CHECKOUT\n----------------------\n\nNeed something you didn't know you needed?  We won't say we told you so!  \nStart the checkout process below...\n(Type quit at any time to leave us)\n");

  inquirer.prompt([
    {
      type: "input",
      message: "What is the ID# of the product you would like to buy? (See above for reference.)",
      name: "id"
    }
  ]).then((response) => {

    if (response.id === "quit") {
      connection.end();
    }

    else {
      let productId = parseInt(response.id);
      
      connection.query("SELECT * FROM products WHERE item_id = ?", productId, (error, response) => {
        if (error) {
          throw error;
        };

        // console.log(response[0].item_id);

        if (response && productId === response[0].item_id) {
          console.log("You have selected ID# " + productId + ": " + response[0].product_name + ".");
          itemQuantity(response[0].item_id);
        } 
        else {
          console.log ("\nWe don't seem to have a product matching that ID#.  Shop again. \n\n");
          buyItem();
        };
      });
    }
  });
};

function itemQuantity (id) {

  let ID = parseInt(id);

  inquirer.prompt([
    {
      type: "input",
      message: "Please enter the quantity you wish to buy.",
      name: "quantity"
    }
  ]).then((response) => {

    if (response.quantity === "quit") {
      connection.end();
    }

    else {
      let quantity = parseInt(response.quantity);
      console.log("You wish to purchase " + quantity + ".");

      // console.log(ID);

      connection.query("SELECT * FROM products WHERE item_id = ?", ID, (error, response) => {
        let price = response[0].price;
        if (error) {
          throw err; 
        }

        if (quantity <= response[0].stock_quantity) {
          connection.query("UPDATE products SET ? WHERE ?", [
            {
              stock_quantity: (response[0].stock_quantity - quantity)
            }, {
              item_id: id
            }
          ], (error, response) => {
            if (error) {
              throw error;
            }

            console.log("Purchase complete! You spent $" + (parseFloat(price*quantity).toFixed(2)) + ". Redirecting to home so you can shop again!");

            stockStore();
          });
        } 
        
        else {
          console.log("Oh no!  We don't have enough in stock to complete your order.  Please try a smaller quantity or a different item.")
          stockStore();
        };
      });
    };
  });
};













