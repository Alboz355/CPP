// Global setup for Jest
const { TextEncoder, TextDecoder } = require('util')

// Add TextEncoder/TextDecoder to global scope
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock document.execCommand for clipboard fallback tests
global.document.execCommand = jest.fn(() => true)

// Mock crypto for Node.js environment
if (typeof global.crypto === 'undefined') {
  global.crypto = {
    getRandomValues: jest.fn((arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256)
      }
      return arr
    }),
    subtle: {
      encrypt: jest.fn(),
      decrypt: jest.fn(),
      generateKey: jest.fn(),
      importKey: jest.fn(),
    }
  }
}