//codes from lab 13 unless otherwise stated

var express = require('express'); //express module
var app = express(); //set module variable
var myParser = require("body-parser"); //body parser module
var products = require('./static/products.js').products; //loads products.js file and sets variable
var querystring = require('qs'); 
const fs = require('fs'); //loads fs module

//records request in the console or all request methods
app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));

//checks for valid submission, redirect to invoice page with submitted data if true, give error message if it is not
app.post("/process_form", function (request, response) {
    let POST = request.body;
    
    //referenced from Meghan Nagai 
    if (typeof POST['purchase_submit'] != 'undefined') {
        var hasvalidquantities = true; //asume quantity is valid
        var hasquantities = false; //assume no quantities
        for (var i = 0; i < products.length; i++) {
            var qty = POST[`quantity${i}`];
            if (qty > 0) {
                hasquantities = true;
            } //has quantity if qty is > 0
            if (isNonNegInt(qty) == false) {
                hasvalidquantities = false;
            } //not valid if the quantity is negative
        }
        const stringified = querystring.stringify(POST); //stringify the the post data 
        if (hasvalidquantities == true && hasquantities == true) {
            response.redirect("./invoice.html?"+stringified); //redirect to invoice page with entered data if quantities are valid
        } else {
                error_message =`<script> alert('Your quantity is invalid!'); window.history.go(-1);</script>`;
                response.send(error_message); //send error message if quantity is invalid
            }
        
    }
});

function isNonNegInt(q, returnErrors = false) {
        errors = []; // assume that quantity data is valid//
        if (q == "") { q = 0; }
        if (Number(q) != q) errors.push('Not a number!'); //check if value is a number//
        if (q < 0) errors.push('Negative value!'); //check if value is a positive number//
        if (parseInt(q) != q) errors.push('Not an integer!'); //check if value is a whole number//
        return returnErrors ? errors : (errors.length == 0);
    }

app.use(express.static('./public')); //references public folder

//code from here on referenced from lab 14

const user_data_filename = 'user_data.json';
app.use(myParser.urlencoded({ extended: true }));


// Process login form POST and redirect to logged in page if ok, back to login page if not
app.post("/process_login", function (request, response) {
    //if user exists, get their password
    if (typeof users_reg_data[request.body.username] != 'undefined') {
        //checking the entered password with the data
        if (request.body.password == users_reg_data[request.body.username].password) {
            response.send(loginsuccess)//thank the user for logging in if password matches what's in the data
        } else {
            incorrectpswmsg = `<script> alert('Your password is incorrect.'); window.history.go(-1);</script>;</script>`
            response.send(incorrectpswmsg); //if password doesn't much, tell them it doesn't
        }
    } else {
        response.send(`ERR: User ${request.body.username} does not exist!`);
    }
});

// process a simple register form
app.post("/process_register", function (request, response) {
    // if all data is valid, write to the user_data_filea and send to invoice 
    username = request.body.username;
    users_reg_data[username] = {};
    users_reg_data[username].password = request.body.password;
    users_reg_data[username].email = request.body.email;
    //write updated object to user_data_filename
    reg_info_str = JSON.stringify(users_reg_data); //turn into a string of JSON data
    fs.writeFileSync(user_data_filename, reg_info_str);


});

var listener = app.listen(8080, () => { console.log('server started listening on port ' + listener.address().port) }); //listening on port 8080