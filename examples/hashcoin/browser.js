// Shim sodium-universal randombytes_buf so the code is similar to `index.js`
function randombytes_buf (buf) { crypto.getRandomValues(buf) }

// Shim sodium-universal crypto_generichash so the code is similar to `index.js`
// but instead of using blake2b, we use the browser native SHA-512
async function crypto_generichash (output, input, key) {
  output.set(new Uint8Array(await crypto.subtle.digest('SHA-512', concat([key, input]))))
}

// clz-buffer acutally works with any array like structure that contains byte
// values in each "cell"
var clz = require('clz-buffer')

async function solve(message, nlz) {
  var output = new Uint8Array(64)
  var key = new Uint8Array(32)
  var input = from(message)

  while (true) {
    randombytes_buf(key)
    await crypto_generichash(output, input, key)
    if (clz(output) >= nlz) return key
  }
}

async function verify (message, key, nlz) {
  var key = new Uint8Array(32)
  var input = from(message)

  await crypto_generichash(output, input, key)
  console.log('clz', clz(output))
  console.log('output (bin)', binaryStr(output))
  return clz(output) >= nlz
}

;(async function main () {

  var difficulty = 4
  var message = '{"vote":"123"}'

  var key, i = 100
  console.time('solve')
  while (i--) key = await solve(message, difficulty)
  console.timeEnd('solve')

  console.log('key (hex)', key)
  console.log('verify', await verify(message, key, difficulty))
})()

function binaryStr (buf) {
  var res = ''
  var pad = '00000000'

  for (var i = 0; i < buf.length; i++) {
    res += (pad + buf[i].toString(2)).slice(-8)
  }

  return res
}

/**
 * Utility method for converting an array of Uint8Arrays to one large Uint8Array
 * @param  {Array<Uint8Array>} arrays
 * @return {Uint8Array}
 */
function concat(arrays) {
  var len = arrays.reduce((sum, arr) => sum + arr.length, 0)

  var buf = new Uint8Array(len)

  arrays.reduce(function (offset, arr) {
    buf.set(arr, offset)
    return offset + arr.length
  }, 0)

  return buf
}

/**
 * Utility for converting a string to a Uint8Array. WARNING: it only supports
 * ASCII as more sophisticated decoding is required for UTF-8
 * @param  {String} message
 * @return {Uint8Array}
 */
function from (message) {
  return new Uint8Array(Array.from(message).map(c => c.charCodeAt(0)))
}
