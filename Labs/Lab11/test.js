age = 21;
name = "Rei";
attributes = name + ";" + age + ";" + (age + 0.5) + ";" + (0.5 - age)
parts = attributes.split(';');

/*
for(part of parts) {
    console.log(`${part} is a ${typeof part}`);
} */

for(i in parts) {
    parts[i] = `${typeof parts[i]} ${parts[i]}`;
}
console.log(parts);
//console.log(parts.join(","));

