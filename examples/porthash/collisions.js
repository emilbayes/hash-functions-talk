var fs = require('fs')
var statistics = require('statistics/mutate.js')
var hash = require('./djb2-i16')
var mapAppend = require('./map-append')
var split = require('buffer-split')

// Keep track of each port / bucket of words
var buckets = new Map()

// Read all the words from the dictionary on osx and split by new lines
var dictionary = fs.readFileSync('/usr/share/dict/words')

var words = split(dictionary, Buffer.from('\n'))

// Hash each word and add to bucket
words.forEach(function (word) {
  mapAppend(buckets, hash(word), word)
})

console.log('Total words:', words.length)
console.log('Total buckets:', buckets.size)

console.log('Emperical Avg:', words.length / buckets.size)
console.log('Theoretical Avg:', words.length / Math.pow(2, 16))

var stats = statistics.initial() // Initial statistic object
for (var [key, bucket] of buckets.entries()) {
  // Expected length is (235887 / 2^16) ≈ 3.6
  // 10 is empirically 3 std. dev. away which is 0.15% if buckets fill by
  // random normal distribution. I do not know is this is a valid assumption
  statistics(stats, bucket.length)

  // Remove this statement if too much output
  if (bucket.length > 10) {
    console.log(bucket.map(word => word.toString()))
  }
}

console.log('Statistics:', stats)
