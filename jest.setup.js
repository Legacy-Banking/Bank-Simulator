// jest.setup.js

import '@testing-library/jest-dom';

// Polyfill for hasPointerCapture
if (typeof Element.prototype.hasPointerCapture !== 'function') {
  Element.prototype.hasPointerCapture = function () {
    return false;
  };
}

// Polyfill for scrollIntoView
if (typeof Element.prototype.scrollIntoView !== 'function') {
    Element.prototype.scrollIntoView = jest.fn();
  }

// Mock ResizeObserver for Jest tests
global.ResizeObserver = class {
  constructor(callback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
};
