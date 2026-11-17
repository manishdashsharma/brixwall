import 'dotenv/config';

const config = {
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || '127.0.0.1',
  port: parseInt(process.env.PORT, 10) || 3000,
  apiVersion: process.env.API_VERSION || 'v1',

  cors: {
    origins: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'],
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },

  docker: {
    socketPath: process.env.DOCKER_SOCKET_PATH || '/var/run/docker.sock',
    timeoutMs: parseInt(process.env.DOCKER_TIMEOUT_MS, 10) || 5000,
    pollIntervalMs: parseInt(process.env.DOCKER_POLL_INTERVAL_MS, 10) || 2000,
  },
};

export default config;
