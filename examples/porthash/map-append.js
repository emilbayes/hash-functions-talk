// Utility method to make sure that we're appending each value to a list of values
// for that key / hash
module.exports = function append(map, key, value) {
  if (!map.has(key)) return map.set(key, [value])

  return map.set(key, map.get(key).concat(value))
}
