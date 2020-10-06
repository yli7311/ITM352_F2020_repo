age_count = 1; // start age count
age = 20;
while(age_count < age) {
    if( (age_count >= age/2) && (age_count < (3/4)*age) ) {
        console.log(`No age zone!`);
        process.exit();
        //console.log(`I'm old!`);
        //break;
    }
    else { 
        console.log(`age ${age_count}`);
    }
    age_count++;
}
console.log(`Yi is ${age_count} years old.`)