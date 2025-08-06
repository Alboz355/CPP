/**
 * @jest-environment jsdom
 */

import { NotificationService } from '../lib/notifications'

// Mock sonner
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    loading: jest.fn(),
    promise: jest.fn(),
    dismiss: jest.fn(),
  },
}))

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
})

describe('NotificationService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('success', () => {
    it('should call toast.success with message only', () => {
      const { toast } = require('sonner')
      NotificationService.success('Success message')
      
      expect(toast.success).toHaveBeenCalledWith('Success message')
    })

    it('should call toast.success with message and description', () => {
      const { toast } = require('sonner')
      NotificationService.success('Success message', 'Description here')
      
      expect(toast.success).toHaveBeenCalledWith('Success message', { description: 'Description here' })
    })
  })

  describe('error', () => {
    it('should call toast.error with message only', () => {
      const { toast } = require('sonner')
      NotificationService.error('Error message')
      
      expect(toast.error).toHaveBeenCalledWith('Error message')
    })

    it('should call toast.error with message and description', () => {
      const { toast } = require('sonner')
      NotificationService.error('Error message', 'Error description')
      
      expect(toast.error).toHaveBeenCalledWith('Error message', { description: 'Error description' })
    })
  })

  describe('copyToClipboard', () => {
    it('should copy text to clipboard and show success notification', async () => {
      const { toast } = require('sonner')
      const writeTextMock = navigator.clipboard.writeText as jest.Mock
      
      await NotificationService.copyToClipboard('test text', 'Copied!')
      
      expect(writeTextMock).toHaveBeenCalledWith('test text')
      expect(toast.success).toHaveBeenCalledWith('Copied!')
    })

    it('should use default success message when none provided', async () => {
      const { toast } = require('sonner')
      const writeTextMock = navigator.clipboard.writeText as jest.Mock
      
      await NotificationService.copyToClipboard('test text')
      
      expect(writeTextMock).toHaveBeenCalledWith('test text')
      expect(toast.success).toHaveBeenCalledWith('Copié dans le presse-papiers')
    })

    it('should fallback to document.execCommand when clipboard API fails', async () => {
      const { toast } = require('sonner')
      const writeTextMock = navigator.clipboard.writeText as jest.Mock
      writeTextMock.mockRejectedValueOnce(new Error('Clipboard API failed'))
      
      // Mock document methods
      const createElementSpy = jest.spyOn(document, 'createElement')
      const appendChildSpy = jest.spyOn(document.body, 'appendChild')
      const removeChildSpy = jest.spyOn(document.body, 'removeChild')
      
      const mockTextArea = {
        value: '',
        select: jest.fn(),
      } as any
      
      createElementSpy.mockReturnValue(mockTextArea)
      appendChildSpy.mockImplementation(() => {})
      removeChildSpy.mockImplementation(() => {})
      
      await NotificationService.copyToClipboard('test text', 'Copied with fallback!')
      
      expect(mockTextArea.value).toBe('test text')
      expect(mockTextArea.select).toHaveBeenCalled()
      expect(document.execCommand).toHaveBeenCalledWith('copy')
      expect(toast.success).toHaveBeenCalledWith('Copied with fallback!')
      
      // Cleanup
      createElementSpy.mockRestore()
      appendChildSpy.mockRestore()
      removeChildSpy.mockRestore()
    })
  })
})