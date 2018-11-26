/**
 * Create Lambda response
 * @param {string} body response
 * @param {integer} statusCode
 * @return {object}
 */
export function createResponse(body = '', statusCode = 200) {
  return {
    statusCode,
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(body),
  };
}
