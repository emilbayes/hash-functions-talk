# DJB2 Hash

This example compares DJB2 hashing in JavaScript and WebAssembly.
They are located in [`javascript.js`](javascript.js) and
[`webassembly`](wasm.js)

To build the WAST (`.wat`) into WASM (`.wasm`) and run from Javascript,
we use a bundler called `wat2js`. You can run `npm run compile` to
do this.

`wat2js` requires emscripten to be installed. You can do that easily from npm:

```sh
npm install -g webassembly-binary-toolkit
```
