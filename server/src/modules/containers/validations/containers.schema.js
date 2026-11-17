import { z } from 'zod';

export const getContainerSchema = z.object({
  id: z
    .string()
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,127}$/, 'Container id or name is invalid'),
});

export const getContainerLogsSchema = z.object({
  tail: z.coerce.number().int().min(1).max(1000).default(200),
});
