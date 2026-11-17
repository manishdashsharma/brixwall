import env from './env.js';

const UNREACHABLE_MESSAGE = 'Could not reach the Brixwall server.';

const buildUrl = (path, params = {}) => {
  const url = new URL(`${env.apiUrl}${path}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, String(value));
    }
  });
  return url;
};

const readBody = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const apiGet = async (path, params) => {
  let response;
  try {
    response = await fetch(buildUrl(path, params));
  } catch {
    throw new Error(UNREACHABLE_MESSAGE);
  }

  const body = await readBody(response);
  if (!response.ok || !body?.success) {
    throw new Error(body?.message || UNREACHABLE_MESSAGE);
  }
  return body.data;
};

const streamUrl = (path) => buildUrl(path).toString();

export { apiGet, streamUrl };
