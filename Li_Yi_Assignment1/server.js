//codes from lab 13 unless otherwise stated

var express = require('express'); //express module
var app = express(); //set module variable
var myParser = require("body-parser"); //body parser module
var products = require('./public/products.js').products; //loads products.js file and sets variable
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
        console.log(qty);
        console.log(products.length);
        const stringified = querystring.stringify(POST);
        if (hasvalidquantities == true && hasquantities == true) {
            response.redirect("./invoice.html?"+stringified);
        } else {
                error_message =`<script> alert('Your quantity is invalid!'); window.history.go(-1);</script>`;
                response.send(error_message);
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

var listener = app.listen(8080, () => { console.log('server started listening on port ' + listener.address().port) }); 