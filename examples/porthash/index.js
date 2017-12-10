var hash = require('./djb2-i16')

var name = process.argv.slice(2).join(' ')

console.log(hash(Buffer.from(name)))
