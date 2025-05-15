const { extractUrls, isValidUrl } = require('../src/utils/url');

describe('URL Utils', () => {
  describe('extractUrls', () => {
    test('extracts valid URLs from text', () => {
      const text = `
        Some text
        https://example.com
        More text
        http://another-example.com
        https://third-example.com/with/path
      `;
      
      const urls = extractUrls(text);
      
      expect(urls).toEqual([
        'https://example.com',
        'http://another-example.com',
        'https://third-example.com/with/path'
      ]);
    });
    
    test('returns empty array for null or empty input', () => {
      expect(extractUrls(null)).toEqual([]);
      expect(extractUrls('')).toEqual([]);
    });
    
    test('only extracts URLs starting with http:// or https://', () => {
      const text = `
        ftp://example.com
        www.example.com
        https://valid-example.com
      `;
      
      const urls = extractUrls(text);
      
      expect(urls).toEqual(['https://valid-example.com']);
    });
    
    test('removes duplicate URLs', () => {
      const text = `
        https://example.com
        https://example.com
        https://another-example.com
      `;
      
      const urls = extractUrls(text);
      
      expect(urls).toEqual([
        'https://example.com',
        'https://another-example.com'
      ]);
    });
  });
  
  describe('isValidUrl', () => {
    test('validates URLs correctly', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://example.com/with/path')).toBe(true);
      expect(isValidUrl('https://example.com?query=param')).toBe(true);
    });
    
    test('rejects invalid URLs', () => {
      expect(isValidUrl(null)).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
      expect(isValidUrl('www.example.com')).toBe(false);
      expect(isValidUrl('ftp://example.com')).toBe(false);
    });
  });
});