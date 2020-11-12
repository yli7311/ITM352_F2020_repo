var express = require('express');
var app = express();
var myParser = require("body-parser");
const fs = require('fs');

const user_data_filename = 'user_data.json';
users_reg_data = JSON.parse(data);

// check if file exists before reading
if ( fs.existsSync(user_data_filename)) {
    stats = fs.statSync(user_data_filename);
    console.log(stats[`size`]);

    var data = fs.readFileSync(user_data_filename, 'utf-8');
    //if user exists, get their password
    if (typeof users_reg_data['itm352'] != 'undefined') {
        console.log(users_reg_data['itm352']['password']=='xxx');
    }
} else {
    console.log(`ERR: ${user_data_filename} does not exist!!!`);
}

/*
fs.readFile(user_data_filename, (err, thedata) => {
    if (err) throw err;
    data = thedata;
    console.log(data);
});
*/



//console.log(users_reg_data, typeof users_reg_data, typeof data);

//console.log(users_reg_data['dport']['password']);

//console.log(users_reg_data);

