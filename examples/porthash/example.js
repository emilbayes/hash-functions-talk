var hash = require('./djb2-i16')

var microserviceName = Buffer.from('soyuz')

hash(microserviceName)
