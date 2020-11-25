//codes from lab 13 unless otherwise stated, assisted by Yuu (a friend)

var express = require('express'); //express module
var app = express(); //set module variable
var myParser = require("body-parser"); //body parser module
var querystring = require('qs'); 
const fs = require('fs'); //loads fs module
var products = require('./static/products.js').products; //loads products.js file and sets variable
const user_data_filename = 'user_data.json';
var user_qty_str = "";

app.use(myParser.urlencoded({ extended: true }));

//process user data from user data file 
var data = fs.readFileSync(user_data_filename, 'utf-8');
users_reg_data = JSON.parse(data);

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
            user_qty_str = stringified;
            response.redirect("./login.html?"+stringified); //redirect to invoice page with entered data if quantities are valid
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
app.use(express.static('./static')); //references static folder

//code from here on referenced from lab 14

// Process login form POST and redirect to logged in page if ok, back to login page if not (writing assisted by Yuu)
app.post("/process_login", function (request, response) {
    //if user exists, get their password
    submitted_username = request.body.username.toLowerCase();//turns submitted username into lowercase 
    if (typeof users_reg_data[submitted_username] != 'undefined') {
        //checking the entered password with the data
        if (request.body.password == users_reg_data[submitted_username].password) {
            user_name = users_reg_data[submitted_username].name;
            response.redirect("./invoice.html?"+user_qty_str+"&user_name="+user_name);
            
        } else {
            response.send(`<script> alert('Your password is incorrect.'); window.history.go(-1);</script>`); //if password doesn't much, tell them it doesn't and send them back
        }
    } else {
        console.log('Invalid username: '+submitted_username);
        response.send(`<script> alert('User ${submitted_username} does not exist!'); window.history.go(-1);</script>`) //if username does not exist, tell them it doesn't and send them back
    }
});

// process a simple register form, regex codes borrowed from https://www.youtube.com/watch?v=vPVx-zGFh0w, https://www.rexegg.com/regex-quickstart.html, and stackoverflow (writing assisted by Yuu)
app.post("/process_register", function (request, response) {
    // if all data is valid, write to the user_data_filea and send to invoice 
    const email_rgx = /^([a-zA-Z0-9 \. -]+)@([a-zA-Z0-9 \.]+).([A-Za-z]{2,3})/ //email formatting 
    const username_rgx = /^([a-zA-Z0-9]{4,10})/ //username formatting
    const password_rgx = /^([.]{6,})/ //password formatting
    const name_rgx = /^([a-zA-Z]{,30})/ //name formatting
    var errors = []; //assume no errors
    var username = request.body.username.toLowerCase(); //set variable username

    if (request.body.name.length > 30) {
        errors.push('Your name is too long.'); //if name is too long, push error
    }
    if (/^([a-zA-Z])/.test(request.body.name.match)) {} else {
        errors.push('Your name is invalid. Please only use letters in your name.'); //if name format is invalid, push error
    }
    if (username.length < 4) {
        errors.push('Your username is too short.'); //if username is too short, push error
    }
    if (username.length > 10) {
        errors.push('Your username is too long.'); //if username is too long, push error
    }
    if (users_reg_data[username] != 'undefined') {
        errors.push('This username already exists.'); //if username already exists, push error
    }
    if (/^([a-zA-Z0-9])/.test(username.match)) {} else {
        errors.push('Your username is invalid. Please only use letters and/or numbers in your username.'); //if username format does not match, push error
    }
    if (/^([a-zA-Z0-9 \. -]+)@([a-zA-Z0-9 \.]+).([A-Za-z]{2,3})/.test(request.body.email)) {} else {
        errors.push('Your email is invalid. Please follow the proper email format.'); //if email format does not match, push error 
    }
    if (request.body.password.length < 6) {
        errors.push('Your password is too short.'); //if password is too short, push error
    }
    if (request.body.passwordrepeat != request.body.password) {
        errors.push('Passwords do not match.'); //if passwords do not match, push error
    }

    if (request.body.email.match(email_rgx),request.body.username.match(username_rgx),request.body.password.match(password_rgx),request.body.passwordrepeat == request.body.password, typeof users_reg_data[username] == 'undefined'){
        users_reg_data[username] = {};
        users_reg_data[username].name = request.body.name;
        users_reg_data[username].password = request.body.password;
        users_reg_data[username].email = request.body.email.toLowerCase();
        //write updated object to user_data_filename

        reg_info_str = JSON.stringify(users_reg_data); //turn into a string of JSON data
        fs.writeFileSync(user_data_filename, reg_info_str);
        
        regsuccessmsg =`<script> alert('Registration successful!'); window.location.href= "/invoice.html?${user_qty_str}&user_name=${request.body.name}";</script>`; //sends alert for registration success and redirects to invoice page
        response.send(regsuccessmsg);
    } else {
        errormsg = `<script> alert('${errors.join(" ")}');window.history.go(-1);</script>`;
        response.send(errormsg);
    }
});

app.post("/send_address", function (request, response) {
    POST = request.body;
    const stringified = querystring.stringify(POST); //stringify the the post data 
    response.redirect("./thankyou.html?"+stringified);
});

var listener = app.listen(8080, () => { console.log('server started listening on port ' + listener.address().port) }); //listening on port 8080