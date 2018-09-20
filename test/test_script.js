const cred = require("../credentials.json");

let code=cred.code;

delete cred.code;

console.log(cred);

console.log(code)