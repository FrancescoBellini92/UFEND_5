import { sendRequest, manageRequestResponse } from '../request-utils';
import '@babel/polyfill';

describe('request utils', () => {
  let isProd: boolean;
  const mockResponseBody = { foo: 'bar' };
  let mockFetchReturnVal;

  beforeEach(() => {
    isProd = false;
    mockFetchReturnVal = {
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockResponseBody)
    };

    global.fetch = jest.fn((url, isProd) => Promise.resolve(mockFetchReturnVal));
  });

  it('makes request', async() => {
    const mockUrl = 'http://foo';
    const response = await sendRequest(mockUrl, isProd);
    expect(fetch).toHaveBeenCalledWith(mockUrl, { mode: 'cors' });
    expect(response).toBe(mockFetchReturnVal);

    isProd = true;
    await sendRequest(mockUrl, isProd);
    expect(fetch['mock'].calls[1][1]).toStrictEqual({ mode: 'same-origin' });
  });

  it('manages response', async() => {
    const mockUrl = 'http://foo';
    const response = await sendRequest(mockUrl, isProd);
    const responsePayload = await manageRequestResponse<{foo: string}>(response);
    expect(responsePayload).toStrictEqual(mockResponseBody);
  });

  it('catches error', async() => {
    const mockUrl = 'http://foo';
    const response = await sendRequest(mockUrl, isProd);
    const errorCheckFn = jest.fn((response) => true);
    const errorHandlerFn = jest.fn(async(response) => { throw new Error('error')} );
    expect(
      async() => {
        const responsePayload = await manageRequestResponse<{foo: string}>(response, errorCheckFn, errorHandlerFn)
        expect(responsePayload).toBeFalsy();
      }
    ).rejects.toThrow();

    expect(errorCheckFn).toHaveBeenCalledWith(response);
    expect(errorHandlerFn).toHaveBeenCalledWith(response);
  });
});
