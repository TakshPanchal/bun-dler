# bun-dler 📦

## Features:
- handles importing modules via `require`
- handles different `import` patterns
- handler setting commonJS and ES6 exporting patterns
- Shows warning on project having circular importing

## Generate Bundle: 
To install dependencies:

```bash
bun install
```

To run:
`index.js` is the entry file for this bundler. It takes `entryPoint` and `root` as CLI args. There are test project files in the `test` dir. 

To bundle a simple test application
This test file contains various edge cases using the `import` keyword, `require` function and `export` keyword.

```bash
# generate bundle.js file
bun run index.js --root ./test/example --entryPoint main.js
# you can run bundle.js on node
node bundle.js
# or on bun
bun run bundle.js
```

To test a project having circular import use the `circular_example` example in the `test` dir.

```bash
# generate bundle.js file
bun run index.js --root ./test/circular_example --entryPoint main.js
# will throw error naming the file having circular dependency 
```
