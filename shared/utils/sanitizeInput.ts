import sanitizeHtml from 'sanitize-html';

/**
 * Sanitizes user input to prevent XSS attacks.
 * @param input - The user input to sanitize.
 * @returns The sanitized input.
 */
export function sanitizeInput(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
}
