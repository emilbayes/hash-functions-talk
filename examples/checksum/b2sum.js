#!/usr/bin/env node

// Use sodium-universal which has cryptographic primitives for both Node.js and
// the browser. In node it will use the native C library libsodium for maximum
// performance, and in the browser it will attempt to use WASM where possible,
// with slower fallbacks in pure Javascript
var sodium = require('sodium-universal')

// Out commandline tool for calculating b2sum's can both calculate and verify.
// If you want to verify we take the expected hash as the 2nd argument, eg.
// `cat FILE | node b2sum HASH_DIGEST`. If the 2nd argument is not set, we will
// calculate the sum and output. (see later)
var expected = process.argv[2]

// Initialize our multipart hash. With an instance we can progressively update
// the hash
var hash = sodium.crypto_generichash_instance(sodium.crypto_generichash_BYTES)

// On each chunk of binary data, we update our hash function
process.stdin.on('data', function (chunk) {
  hash.update(chunk)
})

// When there is no more input, we calculate the final digest
process.stdin.on('end', function () {
  var digest = Buffer.alloc(sodium.crypto_generichash_BYTES)
  hash.final(digest)

  // If we were passed a expected hash value, we decode it from hex and compare
  // and set the process exit code accordingly. It is a UNIX convention that
  // exit code 0 is success, and any other code can be used to signal what went
  // wrong. If we did not get an expected value, we encode the digest as hex,
  // and write it out
  if (expected) {
    var ok = digest.equals(Buffer.from(expected, 'hex'))
    process.exit(ok === true ? 0 : 1)
  }
  else console.log(digest.toString('hex'))
})
