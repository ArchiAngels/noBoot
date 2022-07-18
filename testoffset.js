const offset = require('./store/offset.js');


// let a = offset.getOffset();
// console.log("A",a);

a = offset.getAsInt();
console.log("A",a);

offset.increaseState();
offset.increaseState();
offset.increaseState();
offset.increaseState();
// console.log("A",a);

// a = offset.getOffset();
// console.log("A",a);

a = offset.getAsInt();
console.log("A",a);