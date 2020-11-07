//codes from lab 13 

var express = require('express'); //express module
var app = express(); //set module variable
var myParser = require("body-parser"); //body parser module
var products = require('./public/products.js'); //loads products.js file and sets variable
var querystring = require('qs'); 

//records request in the console or all request methods
app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));

//checks for valid submission, redirect to invoice page with submitted data if true, give error message if it is not
app.post("/process_form", function (request, response) {
    let POST = request.body;
    
    if (typeof POST['purchase_submit'] != 'undefined') {
        for (var i = 0; i < products.length; i++) {
            var hasvalidquantities = true; 
            var hasquantities = false;
            var qty = POST[`quantity${i}`];
            hasquantities=hasquantities || qty>0;
            hasvalidquantities=hasvalidquantities && isNonNegInt(qty);
        }
        const stringified = querystring.stringify(POST);
        if (hasvalidquantities && hasquantities) {
            response.redirect("./invoice.html?"+stringified);
        } else {
                response.send(`Your quantity is invalid!`);
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

app.use(express.static('./public'));

var listener = app.listen(8080, () => { console.log('server started listening on port ' + listener.address().port) });