import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../../../config/api.js';

const LOGS_REFRESH_MS = 4000;

const fetchContainerLogs = async (containerId, tail) => {
  const data = await apiGet(`/v1/containers/${encodeURIComponent(containerId)}/logs`, { tail });
  return data.logs;
};

const useContainerLogs = (containerId, tail) => useQuery({
  queryKey: ['containers', containerId, 'logs', tail],
  queryFn: () => fetchContainerLogs(containerId, tail),
  enabled: Boolean(containerId),
  refetchInterval: LOGS_REFRESH_MS,
});

export { useContainerLogs };
