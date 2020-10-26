export function sendRequest(url: string, isProd: boolean): Promise<Response> {
  return fetch(url, {
    mode: isProd ? 'same-origin' : 'cors'
  });
}

export async function manageRequestResponse<T>(response: Response, errorCheck = (response: Response) => false, errorHandler = (response: Response) => {}):Promise<T> {
  if (errorCheck(response)) {
    errorHandler(response);
  }
  return response.json();
}
