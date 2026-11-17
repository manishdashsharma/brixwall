import http from 'node:http';
import { URLSearchParams } from 'node:url';
import config from '../../config/index.js';

const CONNECTION_ERRORS = {
  ENOENT: [503, 'Docker is not running. Start Docker and try again.'],
  ECONNREFUSED: [503, 'Docker is not running. Start Docker and try again.'],
  EACCES: [503, 'Permission denied on the Docker socket. Check DOCKER_SOCKET_PATH access.'],
};

const buildDockerError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const toQueryString = (query) => {
  const entries = Object.entries(query)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => [key, String(value)]);
  const text = new URLSearchParams(entries).toString();
  return text ? `?${text}` : '';
};

const parseBody = (body, raw) => {
  if (raw) {
    return body;
  }
  try {
    return JSON.parse(body.toString('utf8'));
  } catch {
    throw buildDockerError('Docker returned a response that could not be read', 502);
  }
};

const toConnectionError = (error) => {
  if (error.statusCode) {
    return error;
  }
  const known = CONNECTION_ERRORS[error.code];
  if (known) {
    return buildDockerError(known[1], known[0]);
  }
  return buildDockerError('Could not reach Docker', 502);
};

const dockerRequest = (path, { query = {}, raw = false } = {}) => {
  return new Promise((resolve, reject) => {
    const request = http.request(
      {
        socketPath: config.docker.socketPath,
        path: `${path}${toQueryString(query)}`,
        method: 'GET',
        timeout: config.docker.timeoutMs,
      },
      (response) => {
        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('error', (error) => reject(toConnectionError(error)));
        response.on('end', () => {
          if (response.statusCode === 404) {
            reject(buildDockerError('Container not found', 404));
            return;
          }
          if (response.statusCode >= 400) {
            reject(buildDockerError('Docker could not complete the request', 502));
            return;
          }
          try {
            resolve(parseBody(Buffer.concat(chunks), raw));
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    request.on('timeout', () => {
      request.destroy(buildDockerError('Docker did not respond in time', 504));
    });
    request.on('error', (error) => reject(toConnectionError(error)));
    request.end();
  });
};

const pingDocker = async () => {
  try {
    await dockerRequest('/_ping', { raw: true });
    return true;
  } catch {
    return false;
  }
};

export { dockerRequest, pingDocker };
