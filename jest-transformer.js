// jest-transformer.js
const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  presets: ['next/babel'],
});