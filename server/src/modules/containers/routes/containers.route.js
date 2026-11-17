import express from 'express';
import { validateRequest } from '../../../shared/index.js';
import {
  listContainers,
  getContainer,
  getContainerLogs,
  streamContainers,
} from '../controllers/containers.controller.js';
import {
  getContainerSchema,
  getContainerLogsSchema,
} from '../validations/containers.schema.js';

const router = express.Router();

router.get('/', listContainers);
router.get('/stream', streamContainers);
router.get('/:id', validateRequest(getContainerSchema, 'params'), getContainer);
router.get(
  '/:id/logs',
  validateRequest(getContainerSchema, 'params'),
  validateRequest(getContainerLogsSchema, 'query'),
  getContainerLogs
);

export default router;
