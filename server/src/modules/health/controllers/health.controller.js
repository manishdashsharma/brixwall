import config from '../../../config/index.js';
import {
  httpResponse,
  responseMessage,
  asyncHandler,
  pingDocker,
} from '../../../shared/index.js';

const healthCheck = asyncHandler(async (req, res) => {
  const dockerOnline = await pingDocker();

  return httpResponse(req, res, 200, responseMessage.SUCCESS.HEALTH_CHECK, {
    status: dockerOnline ? 'healthy' : 'degraded',
    docker: dockerOnline ? 'online' : 'offline',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.env,
    version: process.env.npm_package_version || '1.0.0',
  });
});

export { healthCheck };
