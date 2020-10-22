/*
console.log(parseFloat("1.23") + 1);

attributes  =  "Yi;21;Ent.";
parts = attributes.split(';');
console.log(parts);


age = 21;
name = "Yi";
attributes = name + ";" + age + ";" + (age + 0.5) + ";" + (0.5 - age)
parts = attributes.split(';');
//for(part of parts) {
    //console.log(`${part + 100} is a ${typeof part}`);
//}
for(i in parts) {
    parts[i] = `${typeof parts[i]} ${parts[i]}`;
}
console.log(parts.join(","));
*/


function isNonNegIntString(string_to_check, returnErrors=false) {
    //This function returns true if string_to_check is a non-negative intager. If returnErrors=true it will return the array of reasons it is not a non-negative integer.
    errors = []; // assume no errors at first
    if (Number(string_to_check) != string_to_check) errors.push('Not a number!'); // Check if string is a number value
    if (string_to_check < 0) errors.push('Negative value!'); // Check if it is non-negative
    if (parseInt(string_to_check) != string_to_check) errors.push('Not an integer!'); // Check that it is an integer

    //return (errors.length == 0);
    return returnErrors ? errors : (errors.length == 0);
}

attributes  =  "Yi;21;Ent." + (0.5 - 21);
pieces = attributes.split(";");

/*
for(i in pieces) {
    //console.log(isNonNegInt(pieces[i]));
    console.log(`${pieces[i]} is non neg int ${isNonNegInt(pieces[i], true).join("***")}`);
} */

function callback(i, part) {
    console.log(`${pieces[i]} is non neg int ${isNonNegIntString(pieces[i], true).join("***")}`)
}

pieces.forEach(); {
    console.log(`${pieces[i]} is non neg int ${isNonNegInt(pieces[i], true).join("***")}`);
}


