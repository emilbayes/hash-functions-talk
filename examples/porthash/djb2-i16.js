module.exports = function djb2i16 (input) {
  var hash = 5381

  for (var ptr = 0; ptr < input.length; ptr++) {
    hash = hash + ((hash << 5) ^ input[ptr]) | 0
  }

  // Map to range [1025, 65524] ~ (2^10, 2^16)
  return 1025 + ((hash >>> 0) % 64499) | 0
}
