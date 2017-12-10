var numberpad = require('number-pad')

// Note that these give nice port numbers
console.log('http:', numberpad('http'))
console.log('auth:', numberpad('auth'))
console.log('oauth:', numberpad('oauth'))

// okkej is specially chosen since it gives the maximum legal port number
console.log('okkej:', numberpad('okkej'))

// Outside range
console.log('soyuz:', numberpad('soyuz'))

// These two strings have colliding port numbers
console.log('bob:', numberpad('bob'))
console.log('ana:', numberpad('ana'))

// A common string such as `soyuz` gives a number outside the range of legal
// port numbers
console.log('database:', numberpad('database'))
