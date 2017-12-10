var sodium = require('sodium-universal')
var clz = require('clz-buffer')

/**
 * `solve` will find a solution to the cryptographic puzzle in which
 * `hash(key || message)` gives a hash digest with at least `nlz` leading zeros.
 * The number of attempts (ie. the running time) is proportional to `2^{nlz}`,
 * so incrementing nlz by 1, doubles the running time.
 * @param  {Buffer} message Message to solve the puzzle for, encoded as a Buffer
 * @param  {Integer} nlz    "Number of Leading Zeros", between [0, 512]
 * @return {Buffer}         The "solution" to the puzzle, encoded as a Buffer
 */
function solve (message, nlz) {
  // Conforming to sodium API where both output and input is passed as
  // references. In our case this also has the nice bonus that we only need to
  // allocated these once, thus not thrashing the garbage collector
  var output = Buffer.alloc(sodium.crypto_generichash_BYTES)
  var key = Buffer.alloc(sodium.crypto_generichash_KEYBYTES)
  var input = Buffer.from(message)

  // Keep on trying to find a solution infinitely, so in theory this may never
  // stop. In reality, this will finish off after about 2^nlz attemts at most.
  while (true) {
    // since we're working with a cryptographic hash function, where each output
    // bit is assumed to be uniform, our best attempt is to use a random input.
    // So we fill `key` Buffer with random bytes on each attempt
    sodium.randombytes_buf(key)
    sodium.crypto_generichash(output, input, key)
    // Use clz-buffer to find number of leading zeros. We're looking for
    // AT LEAST nlz leading zeros, but more are also allowed
    if (clz(output) >= nlz) return key
  }
}

/**
 * `verify` is very cheap and fast to do, compared to `solve`, since we can
 * easily hash the `message` and `key` then check if it actually has the
 * number of leading zeros we require. This function is almost the same as
 * solving, apart from the loop and some extra debug information used for the
 * presentation
 * @param  {Buffer} message Message to solve the puzzle for, encoded as Buffer
 * @param  {Buffer} key     "solution" as a Buffer
 * @param  {Integer} nlz    "Number of Leading Zeros", between [0, 512]
 * @return {Boolean}        Valid solution or not
 */
function verify (message, key, nlz) {
  var output = Buffer.alloc(sodium.crypto_generichash_BYTES)
  var input = Buffer.from(message)

  sodium.crypto_generichash(output, input, key)
  console.log('clz', clz(output))
  console.log('output (bin)', binaryStr(output))
  return clz(output) >= nlz
}

// We default to a difficulty of 10 leading zeros, but other values can be
// passed on the commandline as the first argument, eg. `node hashcoin 12`
var difficulty = parseInt(process.argv[2], 10) || 10

// The message we're trying to solve the puzzle for. This could be anything, but
// here we're looking to solve for a simple JSON payload
var message = process.argv.slice(3).join(' ') || '{"vote":"123"}'

// To see the expected running time, ie. average, we solve the puzzle many times
// since sometimes we might be lucky and solve it in the first try, and other
// times we might have to try many time to solve it
var key, i = 100
console.time('solve')
while (i--) key = solve(message, difficulty)
console.timeEnd('solve')

// Output some debug information so we can see the solution and then verify
console.log('key (hex)', key)
console.log('verify', verify(message, key, difficulty))

/**
 * Utility method to encode a buffer as base 2 (ie. binary)
 * @param  {Buffer} buf
 * @return {String}
 */
function binaryStr (buf) {
  var res = ''
  var pad = '00000000'

  for (var i = 0; i < buf.length; i++) {
    res += (pad + buf[i].toString(2)).slice(-8)
  }

  return res
}
