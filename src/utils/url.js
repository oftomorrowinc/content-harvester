/**
 * Extracts valid URLs from a text string
 * @param {string} text - Text that may contain URLs
 * @returns {string[]} Array of valid URLs
 */
const extractUrls = text => {
  if (!text) return [];

  // Split by newlines and other common separators
  const lines = text.split(/[\n,;]/);

  // Filter for valid URLs (must start with http:// or https://)
  const urls = lines
    .map(line => line.trim())
    .filter(line => line.startsWith('http://') || line.startsWith('https://'));

  // Remove duplicates
  return [...new Set(urls)];
};

/**
 * Checks if a string is a valid URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if valid URL
 */
const isValidUrl = url => {
  if (!url) return false;

  // Must start with http:// or https://
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return false;
  }

  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  extractUrls,
  isValidUrl,
};
