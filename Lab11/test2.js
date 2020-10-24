function isNonNegInt(string_to_check, returnErrors=false) {
    errors = []; // assume no errors at first
    if (Number(string_to_check) != string_to_check) errors.push('Not a number!'); // Check if string is a number value
    if (string_to_check < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(string_to_check) != string_to_check) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
}
//console.log(isNonNegIntString(-5.23, true));

attributes  =  "Rei;21;Ent." + (0.5 - 21);
pieces = attributes.split(";");

for(i in pieces) {
    console.log(i);
    console.log( `${pieces[i]} is non neg int ${isNonNegInt(pieces[i])}`)
}

/*
function callback(i, part) {
    console.log(`${pieces[i]} is non neg int ${isNonNegIntString(pieces[i], true).join("***")}`)
}

pieces.forEach(); {
    console.log(`${pieces[i]} is non neg int ${isNonNegInt(pieces[i], true).join("***")}`);
}
*/
