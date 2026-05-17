/**
 * Sanitize user input by escaping HTML and script tags
 * @param {string} input - User input string
 * @returns {string} - Sanitized string
 */
export const sanitizeInput = (input) => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  // Create a temporary div element
  const temp = document.createElement('div');
  temp.textContent = input;
  
  // Get the sanitized text (HTML entities are escaped)
  return temp.innerHTML;
};

/**
 * Strip HTML tags from string
 * @param {string} input - Input string with potential HTML
 * @returns {string} - String without HTML tags
 */
export const stripHtml = (input) => {
  if (!input || typeof input !== 'string') {
    return '';
  }
  
  const temp = document.createElement('div');
  temp.innerHTML = input;
  return temp.textContent || temp.innerText || '';
};
