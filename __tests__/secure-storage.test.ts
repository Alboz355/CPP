/**
 * @jest-environment jsdom
 */

import { BasicSecureStorage } from '../lib/secure-storage'

describe('BasicSecureStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('setItem and getItem', () => {
    it('should encode and decode data correctly', () => {
      const key = 'test_key'
      const value = 'test_value'

      BasicSecureStorage.setItem(key, value)
      const retrieved = BasicSecureStorage.getItem(key)

      expect(retrieved).toBe(value)
      expect(localStorage.getItem(`basic_secure_${key}`)).toBeTruthy()
    })

    it('should return null for non-existent key', () => {
      const result = BasicSecureStorage.getItem('non_existent_key')
      expect(result).toBeNull()
    })

    it('should handle encoding/decoding errors gracefully', () => {
      // Manually set invalid encoded data
      localStorage.setItem('basic_secure_invalid', 'invalid_base64!')
      
      const result = BasicSecureStorage.getItem('invalid')
      expect(result).toBeNull()
    })

    it('should handle special characters', () => {
      const key = 'special_key'
      const value = 'Test with épeciál characters & symbols! @#$%'

      BasicSecureStorage.setItem(key, value)
      const retrieved = BasicSecureStorage.getItem(key)

      expect(retrieved).toBe(value)
    })

    it('should handle empty strings', () => {
      const key = 'empty_key'
      const value = ''

      BasicSecureStorage.setItem(key, value)
      const retrieved = BasicSecureStorage.getItem(key)

      // Empty strings should be handled properly
      expect(retrieved).toBe('')
      // The key should exist in localStorage even if the encoded value is empty
      expect(localStorage.getItem(`basic_secure_${key}`)).toBe('')
    })
  })

  describe('removeItem', () => {
    it('should remove item from localStorage', () => {
      const key = 'test_key'
      BasicSecureStorage.setItem(key, 'test_value')
      
      expect(localStorage.getItem(`basic_secure_${key}`)).toBeTruthy()
      
      BasicSecureStorage.removeItem(key)
      
      expect(localStorage.getItem(`basic_secure_${key}`)).toBeNull()
    })
  })

  describe('clear', () => {
    it('should clear all basic secure storage items', () => {
      BasicSecureStorage.setItem('key1', 'value1')
      BasicSecureStorage.setItem('key2', 'value2')
      localStorage.setItem('other_key', 'other_value')
      
      BasicSecureStorage.clear()
      
      expect(BasicSecureStorage.getItem('key1')).toBeNull()
      expect(BasicSecureStorage.getItem('key2')).toBeNull()
      expect(localStorage.getItem('other_key')).toBe('other_value') // Should not be cleared
    })

    it('should not affect regular localStorage items', () => {
      localStorage.setItem('regular_key', 'regular_value')
      localStorage.setItem('another_key', 'another_value')
      BasicSecureStorage.setItem('secure_key', 'secure_value')
      
      BasicSecureStorage.clear()
      
      expect(localStorage.getItem('regular_key')).toBe('regular_value')
      expect(localStorage.getItem('another_key')).toBe('another_value')
      expect(BasicSecureStorage.getItem('secure_key')).toBeNull()
    })
  })
})