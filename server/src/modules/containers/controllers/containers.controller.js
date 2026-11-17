import {
  httpResponse,
  httpError,
  responseMessage,
  asyncHandler,
  logger,
} from '../../../shared/index.js';
import {
  listContainersService,
  getContainerService,
  getContainerLogsService,
  subscribeContainersService,
} from '../services/containers.service.js';

const HEARTBEAT_INTERVAL_MS = 15000;

const listContainers = asyncHandler(async (req, res) => {
  try {
    const result = await listContainersService();
    return httpResponse(req, res, 200, responseMessage.SUCCESS.FETCHED, result);
  } catch (error) {
    logger.error('List containers failed', {
      error: error.message,
      stack: error.stack,
      requestId: req.requestId,
    });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const getContainer = asyncHandler(async (req, res) => {
  try {
    const container = await getContainerService(req.params.id);
    return httpResponse(req, res, 200, responseMessage.SUCCESS.FETCHED, container);
  } catch (error) {
    logger.error('Get container failed', {
      error: error.message,
      stack: error.stack,
      containerId: req.params.id,
      requestId: req.requestId,
    });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const getContainerLogs = asyncHandler(async (req, res) => {
  try {
    const logs = await getContainerLogsService(req.params.id, req.query);
    return httpResponse(req, res, 200, responseMessage.SUCCESS.FETCHED, { logs });
  } catch (error) {
    logger.error('Get container logs failed', {
      error: error.message,
      stack: error.stack,
      containerId: req.params.id,
      requestId: req.requestId,
    });
    return httpError(req, res, error, error.statusCode || 500);
  }
});

const streamContainers = (req, res) => {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders();

  const sendSnapshot = (snapshot) => {
    res.write(`event: snapshot\ndata: ${JSON.stringify(snapshot)}\n\n`);
  };

  const unsubscribe = subscribeContainersService(sendSnapshot);
  const heartbeat = setInterval(() => res.write(': ping\n\n'), HEARTBEAT_INTERVAL_MS);

  logger.info('Container stream opened', { requestId: req.requestId });

  req.on('close', () => {
    clearInterval(heartbeat);
    unsubscribe();
    logger.info('Container stream closed', { requestId: req.requestId });
  });
};

export { listContainers, getContainer, getContainerLogs, streamContainers };
