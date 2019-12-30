const mysql = require("mysql");
const inquirer = require('inquirer');
require('console.table');

const separator = "-------------------------------------------------------------------"; 

//database configuration 
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'root',
    database: 'bamazon'
});

//database connection
connection.connect(function(err){

    if(err) {
        console.log(`Error connection to the database`);
    }
    startProgram();
});

function startProgram(){
    displayProducts();
}

function displayProducts(){
    connection.query("SELECT * FROM products", function(err, result){
        if(err) throw err;
        console.log(separator + "\n\n"); 
        console.table(result);
        console.log("\n\n" + separator); 
        promptQuestions(result);
    });
}

function promptQuestions(stock){
    inquirer
    .prompt([
        {
            type: "input",
            message: "Enter the ID of the product you would like to buy: ",
            name: "choice",
        }

    ])
    .then(function(val) {
        checkIfExit(val.choice); 
        

        const chosenProductId = parseInt(val.choice); 
        const product = inStock(chosenProductId, stock ); 
        

        if(product){
            promptQuantity(product); 
        }else{
            console.log(`${separator} \n\n Sorry, the product is not in stock \n\n ${separator}`); 
            displayProducts(); 
        }


    });

}

 //Check if user chose to quit 
 function checkIfExit(userChoice){
    if (userChoice === 'q'){
        console.log(separator + "\n\nThank you. Visit again!\n\n" + separator); 
        process.exit(0); 
    }
}

function inStock(chosenProductId, stock){
    for(let i=0; i< stock.length; i++){
        if(stock[i].item_id === chosenProductId){
            return stock[i];
        }
       
    }
    return null; 
}

function promptQuantity(chosenProductId){
    inquirer
    .prompt([
        {
            type: "input", 
            message: "Enter the quantity: ",
            name: "quantity"
        }
    ])
    .then(function(val){
        checkIfExit(val.quantity); 
        const orderQuantity = parseInt(val.quantity); 

        if(orderQuantity > chosenProductId.stock_quantity){
            console.log(separator+ "\n\n Insufficient available quantity for selected product. \n\n" + separator);
            displayProducts();  
        }else{
            fulfillOrder(chosenProductId, orderQuantity); 
        }
    });
}

function fulfillOrder(product, quantity) {
    connection.query(
    "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
      [quantity, product.item_id],
      function(err, res) {
        // Let the user know the purchase was successful, re-run loadProducts
        if(err) throw err;
        console.log(`${separator} \n\n Order placed succesfully for ${product.product_name} (Qty ${quantity})`);
        displayProducts();
      }
    );
  }