//code referenced from lab 13, 14, and 15, assisted by Yuu and Qinshou 

const express = require('express'); //express module
const session = require('express-session'); 
const cookieParser = require('cookie-parser');
const app = express(); //set module variable
const myParser = require("body-parser"); //body parser module
const querystring = require('qs');
const fs = require('fs'); //loads fs module
const user_data_filename = 'user_data.json'; //constant filepath to all user data
const products = require('./products.json'); //loads products.json file and sets variable
const nodemailer = require('nodemailer');
const { allowedNodeEnvironmentFlags } = require('process');

app.use(myParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({secret: "ITM352 rocks!", resave: false, saveUninitialized: true}));

app.use(express.static('./static')); //references static folder

//referenced from lab 15 + expressjs.com
app.use(session({secret: 'ITM352 rocks!', resave: true, saveUninitialized: false, secure: true}));

//process user data from user data file
var data = fs.readFileSync(user_data_filename, 'utf-8');
users_reg_data = JSON.parse(data);

//send products data
app.get("/get_products_data", function (request, response) {
  response.json(products);
});

//referenced from assignment #3 examples + Daphne. initialize an object to store the cart + user in the session
app.all('*', function(request, response, next) {
  if (typeof request.session.cart == 'undefined') {
    request.session.cart =  {};
        for (pk in products) {
            emptyArray = new Array(products[pk].length).fill(0)
            request.session.cart[pk] = emptyArray;
        }
        console.log("cart:", request.session.cart);
      }
    console.log("username:", request.session.user);
  next();
});

//checks for valid submission, redirect to cart page with submitted data if true, give error message if it is not, code referenced from assignment #3 examples
app.get("/add_to_cart", function (request, response) {
  var category = request.query['category']; // get the product key sent from the form post
  var quantities = request.query['quantity'].map(Number); // Get quantities from the form post and convert strings from form post to numbers
  //referenced from Meghan Nagai
  if (isNonNegInt(request.body.quantity) == true) {
      quantities.forEach((quantity, i) => {
        request.session.cart[category][i] = quantity; // store the quantities array in the session cart object with the same products_key.
      });
      console.log(request.session.cart);
      response.redirect('./cart.html');
    } else {
        error_message =`<script> alert('Your quantity is invalid!'); window.history.go(-1);</script>`;
        response.send(error_message); //send error message if quantity is invalid
    }
});

//referenced from assignment #3, sends session cart data
app.get("/get_cart", function (request, response) {
  console.log(request.session)
  response.json(request.session.cart);
});

//referenced from assignment #3, sends user data
app.get("/get_user", function (request, response) {
  response.json(request.session.user);
});

//sign user out and delete all session data, assisted by Qinshou
app.get("/sign_out", function(request, response) {
  console.log("sign out");
  let headers = request.headers;
  delete request.session.user;
  delete request.session.user_name;
  delete request.session.email;
  delete request.session.cart;
  request.session.save();

  response.redirect(headers.referer.split(headers.host)[1]);
});

function isNonNegInt(q, returnErrors = false) {
    errors = []; // assume that quantity data is valid
    if (q == "") { q = 0; }
    if (q == undefined) { q = 0; }
    if (Number(q) != q) errors.push('Not a number!'); //check if value is a number
    if (q < 0) errors.push('Negative value!'); //check if value is a positive number
    if (parseInt(q) != q) errors.push('Not an integer!'); //check if value is a whole number
    return returnErrors ? errors : (errors.length == 0);
  }

// Process login form POST and redirect to logged in page if ok, back to login page if not (writing assisted by Yuu)
app.post("/process_login", function (request, response) {
  //if user exists, get their password
  submitted_username = request.body.username.toLowerCase();//turns submitted username into lowercase
  if (typeof users_reg_data[submitted_username] != 'undefined') {
    //checking the entered password with the data
    if (request.body.password == users_reg_data[submitted_username].password) { //checks if passwords are the same
      user_name = users_reg_data[submitted_username].name; //updates global username variable

      //save session user information
      console.log(request.session)
      request.session.user = submitted_username;
      request.session.user_name = users_reg_data[submitted_username].name;
      request.session.email = users_reg_data[submitted_username].email;
      request.session.save();

      response.redirect(`/index.html`);
    } else {
      response.send(`<script> alert('Your password is incorrect.'); window.history.go(-1);</script>`); //if password doesn't much, tell them it doesn't and send them back
    }
  } else {
    console.log('Invalid username: '+submitted_username); //log
    response.send(`<script> alert('User ${submitted_username} does not exist!'); window.history.go(-1);</script>`) //if username does not exist, tell them it doesn't and send them back to the login page
  }
});

// process a simple register form, regex codes borrowed from https://www.youtube.com/watch?v=vPVx-zGFh0w, https://www.rexegg.com/regex-quickstart.html, and stackoverflow (writing assisted by Yuu)
app.post("/process_register", function (request, response) {
  // if all data is valid, write to the user_data_filea
  var errors = [];
  var username = request.body.username.toLowerCase(); //makes username case blind

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
  if (typeof users_reg_data[username] != 'undefined') {
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

  if (errors.length == 0) {
    users_reg_data[username] = {}; //creates a new item in users_reg_data with username
    users_reg_data[username].name = request.body.name; //adding info
    users_reg_data[username].password = request.body.password;
    users_reg_data[username].email = request.body.email.toLowerCase();

    //write updated object to user_data_filename
    reg_info_str = JSON.stringify(users_reg_data); //turn into a string of JSON data
    fs.writeFileSync(user_data_filename, reg_info_str);

    request.session.user = username;
    request.query.user_name = users_reg_data[username].name;
    request.query.email = users_reg_data[username].email;

    //sends alert for registration success and redirects to invoice page
    regsuccessmsg =`<script> alert('Registration successful!'); window.location.href= "/index.html";</script>`;
    response.send(regsuccessmsg);
  } else {
    console.log("Registration error: " + errors.join(" "));
    errormsg = `<script> alert('${errors.join(" ")}');window.history.go(-1);</script>`; //go back one window, error alert
    response.send(errormsg);
  }
});

//sends invoice to user, referenced from assignment #3 examples, writing assisted by Qinshou
app.get("/checkout", function (request, response) {
    var user_email = request.session.email;
     var shopping_cart = request.session.cart;

  invoice_str = `<table border="2">    <tbody>
  <tr>
      <th style="text-align: center;" width="45%">Item</th>
      <th style="text-align: center;" width="15%">Quantity</th>
      <th style="text-align: center;" width="15%">Price</th>
      <th style="text-align: center;" width="35%">Extended price</th>
  </tr>`;
  var subtotal = 0;
  //code referenced from assignment #3 examples, listing products and information in the invoice if they have quantity data in the shopping cart
  for (let category in products) {
    for (let i = 0; i < products[category].length; i++) {
        qty = shopping_cart[category][i];
        if (qty > 0) {
            // product row
            extended_price = shopping_cart[category][i] * products[category][i].price;
            subtotal += extended_price;
            invoice_str += `
                <tr>
                    <td>${products[category][i].name}</td>
                    <td align="center">${shopping_cart[category][i]}</td>
                    <td>\$ ${products[category][i].price.toFixed(2)}</td>
                    <td>\$ ${extended_price.toFixed(2)}</td>
                </tr>`;
        }
    }
  }
  //Tax
  var taxrate = 0.0575;
  var tax = taxrate * subtotal;

  //Shipping
  var shipping = 4;
  if (subtotal >= 50) {
    shipping = 0.05 * subtotal;
  }
  else if (subtotal >= 30) {
    shipping = 6;
  }

  //Grand total
  var gtot = subtotal + tax + shipping;

  invoice_str += `
  <tr><td colspan="4" width="100%">&nbsp;</td></tr>
  <tr>
    <td style="text-align: center;" colspan="3" width="70%">Sub-total</td>
    <td width="40%">$ ${subtotal.toFixed(2)}</td>
  </tr>
  <tr>
    <td style="text-align: center;" colspan="3" width="70%">Tax @ 5.75%</td>
    <td width="40%">$ ${tax.toFixed(2)}</td>
  </tr>
  <tr>
    <td style="text-align: center;" colspan="3" width="70%">Shipping</td>
    <td width="40%">$ ${shipping.toFixed(2)}</td>
  </tr>
  <div>
    <tr>
        <td style="text-align: center;" colspan="3" width="70%">
            <p>Total</p>
        </td>
        <td width="40%">
            <p class="grand_total">$ ${gtot.toFixed(2)}</p>
        </td>
    </tr>
  </div>
  </tbody></table>`;
  // Set up mail server. Only will work on UH Network due to security restrictions
    var transporter = nodemailer.createTransport({
      host: "mail.hawaii.edu",
      port: 25,
      secure: false, // use TLS
      tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false
      }
    });
  
    var mailOptions = {
      from: 'phoney_store@bogus.com',
      to: user_email,
      subject: 'Your phoney invoice',
      html: invoice_str
    };
  
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log("There was an error and your invoice could not be emailed :(");
        // invoice_str += '<br>There was an error and your invoice could not be emailed :(';
      } else {
        console.log(`Your invoice was mailed to ${user_email}`);
        // invoice_str += `<br>Your invoice was mailed to ${user_email}`;
      }
    });
   
  // sign out and erase all session + cookie data
  session.user = "";
  delete request.session.user;
  delete request.session.user_name;
  delete request.session.email;
  delete request.session.cart;
  request.session.save();

  response.redirect("/thankyou.html");
});

var listener = app.listen(8080, () => { console.log('server started listening on port ' + listener.address().port) }); //listening on port 8080
