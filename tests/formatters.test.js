const { formatSize } = require('../src/utils/formatters');

describe('Formatters', () => {
  describe('formatSize', () => {
    test('formats file sizes correctly', () => {
      expect(formatSize(0)).toBe('0 Bytes');
      expect(formatSize(1024)).toBe('1 KB');
      expect(formatSize(1048576)).toBe('1 MB');
      expect(formatSize(1073741824)).toBe('1 GB');
      expect(formatSize(2.5 * 1024 * 1024)).toBe('2.5 MB');
    });
    
    test('handles null or undefined values', () => {
      expect(formatSize(null)).toBe('0 Bytes');
      expect(formatSize(undefined)).toBe('0 Bytes');
    });
  });
});