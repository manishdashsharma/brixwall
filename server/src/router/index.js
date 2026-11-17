import express from 'express';
import { healthRoutes } from '../modules/health/index.js';
import { containersRoutes } from '../modules/containers/index.js';

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/containers', containersRoutes);

export default router;
