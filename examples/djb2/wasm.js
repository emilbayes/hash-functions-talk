var djb2 = require('./djb2-wasm.js')

console.log(djb2(Buffer.from('soyuz')))
