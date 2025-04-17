const Base = require('../lib/class/Base');
const fs = require('fs');
const path = require('path');

// Mock filesystem
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  mkdirSync: jest.fn()
}));

// Mock request
jest.mock('request', () => {
  return jest.fn((options, callback) => {
    // Simulate successful API response
    const mockResponse = { statusCode: 200 };
    const mockBody = JSON.stringify({
      errcode: 0,
      errmsg: 'ok',
      access_token: 'mock_access_token',
      expires_in: 7200
    });
    callback(null, mockResponse, mockBody);
  });
});

describe('Base Class', () => {
  let base;
  
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Create a new instance for each test
    base = new Base();
    
    // Default mock for configuration
    base.corpid = 'test_corpid';
    base.agent_secret = 'test_agent_secret';
    base.concat_secret = 'test_concat_secret';
  });
  
  describe('getAccessToken', () => {
    it('should fetch a new token when no token file exists', async () => {
      // Mock file does not exist
      fs.existsSync.mockReturnValue(false);
      
      const token = await base.getAccessToken();
      
      expect(token).toBe('mock_access_token');
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
    
    it('should read token from file if valid', async () => {
      // Mock file exists
      fs.existsSync.mockReturnValue(true);
      
      // Mock valid token in file
      const mockTokenData = {
        access_token: 'file_access_token',
        expires_time: Date.now() + 3600000 // Valid for another hour
      };
      fs.readFileSync.mockReturnValue(JSON.stringify(mockTokenData));
      
      const token = await base.getAccessToken();
      
      expect(token).toBe('file_access_token');
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.readFileSync).toHaveBeenCalled();
      expect(fs.writeFileSync).not.toHaveBeenCalled();
    });
    
    it('should fetch new token if existing token is expired', async () => {
      // Mock file exists
      fs.existsSync.mockReturnValue(true);
      
      // Mock expired token in file
      const mockTokenData = {
        access_token: 'expired_access_token',
        expires_time: Date.now() - 3600000 // Expired an hour ago
      };
      fs.readFileSync.mockReturnValue(JSON.stringify(mockTokenData));
      
      const token = await base.getAccessToken();
      
      expect(token).toBe('mock_access_token');
      expect(fs.existsSync).toHaveBeenCalled();
      expect(fs.readFileSync).toHaveBeenCalled();
      expect(fs.writeFileSync).toHaveBeenCalled();
    });
    
    it('should handle agent type access token', async () => {
      fs.existsSync.mockReturnValue(false);
      
      const token = await base.getAccessToken(null, 'agent');
      
      expect(token).toBe('mock_access_token');
      // Should use agent_secret for this type
      expect(base.curl).toHaveBeenCalledWith(
        expect.stringContaining('agent_secret'),
        expect.any(String),
        expect.any(Object)
      );
    });
    
    it('should handle concat type access token', async () => {
      fs.existsSync.mockReturnValue(false);
      
      const token = await base.getAccessToken(null, 'concat');
      
      expect(token).toBe('mock_access_token');
      // Should use concat_secret for this type
      expect(base.curl).toHaveBeenCalledWith(
        expect.stringContaining('concat_secret'),
        expect.any(String),
        expect.any(Object)
      );
    });
  });
  
  describe('curl', () => {
    it('should make HTTP GET requests properly', async () => {
      const result = await base.curl('https://test-api.com/endpoint', 'GET', { param: 'value' });
      
      expect(result).toEqual({
        errcode: 0,
        errmsg: 'ok',
        access_token: 'mock_access_token',
        expires_in: 7200
      });
    });
    
    it('should make HTTP POST requests properly', async () => {
      const result = await base.curl('https://test-api.com/endpoint', 'POST', { param: 'value' });
      
      expect(result).toEqual({
        errcode: 0,
        errmsg: 'ok',
        access_token: 'mock_access_token',
        expires_in: 7200
      });
    });
    
    it('should handle errors from the API', async () => {
      // Override the mock for this test to simulate an error
      const request = require('request');
      request.mockImplementationOnce((options, callback) => {
        const mockResponse = { statusCode: 200 };
        const mockBody = JSON.stringify({
          errcode: 40001,
          errmsg: 'invalid credential'
        });
        callback(null, mockResponse, mockBody);
      });
      
      const result = await base.curl('https://test-api.com/endpoint', 'GET', {});
      
      expect(result).toEqual({
        errcode: 40001,
        errmsg: 'invalid credential'
      });
    });
  });
}); 