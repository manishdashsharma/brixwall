import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { randomUUID } from 'crypto';

import config from './config/index.js';
import {
  logger,
  errorHandler,
  notFoundHandler,
  httpResponse,
} from './shared/index.js';
import router from './router/index.js';

const app = express();

app.use(helmet());

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = config.cors.origins;
    const allowed = !origin
      || allowedOrigins.includes('*')
      || allowedOrigins.includes(origin);
    callback(null, allowed);
  },
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const isEventStream = (req) => req.headers.accept === 'text/event-stream';

app.use(
  compression({
    filter: (req, res) => !isEventStream(req) && compression.filter(req, res),
  })
);

app.use(
  morgan('combined', {
    stream: { write: (message) => logger.info(message.trim()) },
  })
);

app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
  req.requestId = randomUUID();
  res.setHeader('X-Request-ID', req.requestId);
  next();
});

app.get('/', (req, res) => {
  return httpResponse(req, res, 200, 'Brixwall API', {
    name: 'Brixwall API',
    version: config.apiVersion,
    environment: config.env,
    timestamp: new Date().toISOString(),
    health: '/v1/health',
  });
});

app.use('/v1', router);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
