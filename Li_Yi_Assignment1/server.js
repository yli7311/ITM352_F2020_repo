//codes from lab 13 

var express = require('express');
var app = express();
var myParser = require("body-parser");
var fs = require('fs');
var data = require('./static/products.js');
var QueryString = require('qs');
var products = data.products;

//records request in the console
app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));

app.post("/process_form", function (request, response) {
    let POST = request.body;
    
    if (typeof POST['purchase_submit'] != 'undefined') {
        for (var i = 0; i < products.length; i++) {
            var qty = POST[`quantity${i}`];
            if (isNonNegInt(qty)) {
                var contents = fs.readFileSync('./views/display_quantity_template.view', 'utf8');
                const submission = QueryString.stringify(POST);
                response.redirect("./invoice.html"+submission)
            } else {
                response.send(`Your quantity is invalid!`);
            }
        }
    }
});

app.use(express.static('./static'));

var listener = app.listen(8080, () => { console.log('server started listening on port ' + listener.address().port) });