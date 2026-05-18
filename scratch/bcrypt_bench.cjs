const bcrypt = require('bcryptjs');
const start = Date.now();
bcrypt.hashSync('test', 10);
console.log(`Hash took: ${Date.now() - start}ms`);
const hash = bcrypt.hashSync('test', 10);
const start2 = Date.now();
bcrypt.compareSync('test', hash);
console.log(`Compare took: ${Date.now() - start2}ms`);
