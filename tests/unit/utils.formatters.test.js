const { formatSize } = require('../../src/utils/formatters');

describe('Formatters Utils', () => {
  describe('formatSize', () => {
    test('formats file sizes correctly', () => {
      expect(formatSize(0)).toBe('0 Bytes');
      expect(formatSize(1024)).toBe('1 KB');
      expect(formatSize(1048576)).toBe('1 MB');
      expect(formatSize(1073741824)).toBe('1 GB');
      expect(formatSize(1099511627776)).toBe('1 TB');
      expect(formatSize(2.5 * 1024 * 1024)).toBe('2.5 MB');
      expect(formatSize(1024 * 1024 * 3.45)).toBe('3.45 MB');
    });

    test('handles edge cases', () => {
      expect(formatSize(null)).toBe('0 Bytes');
      expect(formatSize(undefined)).toBe('0 Bytes');
      expect(formatSize('')).toBe('0 Bytes');
      expect(formatSize(NaN)).toBe('0 Bytes');
      expect(formatSize(-1024)).toBe('0 Bytes'); // Negative should be 0
    });
  });
});
