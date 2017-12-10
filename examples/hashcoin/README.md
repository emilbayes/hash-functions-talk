# Hashcoin

See [`index.js`](index.js) which has heavy comments. It first defines the
two main functions, `solve` and `verify`, and then the command line API.

You can run the demo with with a specific difficulty which must be integer
and an arbitrary string that you will try to solve:

```sh
node index.js [DIFFICULTY=10] [PUZZLE...={"vote":"123"}]
```

The code also works in the browser (except the CLI stuff), but there is also
an attempt at a solution based on SubtleCrypto in [`browser.js`](browser.js)
