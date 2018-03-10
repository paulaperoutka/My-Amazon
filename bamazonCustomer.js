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
    console.log("Connected as id: " + connection.threadId);

    //do some things here

    // connection.end();
})