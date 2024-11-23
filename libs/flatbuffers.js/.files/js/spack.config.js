const { config } = require("@swc/core/spack");

module.exports = config({
  entry: {
    flatbuffers: __dirname + "/flatbuffers.ts",
  },
  output: {
    path: __dirname,
    name: 'index.js',
  },
  module: {},
  mode: 'production',
});