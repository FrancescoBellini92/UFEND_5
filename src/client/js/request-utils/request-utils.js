export function sendRequest(url, isProd) {
  return fetch(url, {
    mode: isProd ? 'same-origin' : 'cors'
  });
}

export async function manageRequestResponse(response, errorCheck = () => {}, errorHandler = () => {}) {
  if (errorCheck(response)) {
    errorHandler(response);
    throw new Error(`Request failed: ${response.status}`);
  }
  const payload = await response.json();
  return payload;
}
