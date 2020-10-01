age_count = 1; // start age count
age = 20;
while(age_count < age) {
    if(age_count >= age/2) {
        // console.log(`age ${age_count}`);
        console.log(`I'm old!`);
        break;
    }
    console.log(`age ${age_count}`);
    age_count++;

}
console.log(`Yi is ${age_count} years old.`)