const mysql = require("mysql");
const inquirer = require('inquirer');
require('console.table');


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
    }else{
        console.log(`Database connection successful`);
    }
    startProgram();
});

function startProgram(){
    displayProducts();
}

function displayProducts(){
    connection.query("SELECT * FROM products", function(err, result){
        if(err) throw err;
        console.table(result);
        promptQuestions();
    });
}

function promptQuestions(){
    inquirer
    .prompt([
        {
            type: "input",
            message: "Enter the ID of the product you would like to buy: ",
            name: "choice",
            validate: function(val){
                
            }
        }

    ])
    .then(answers => {

    });
}