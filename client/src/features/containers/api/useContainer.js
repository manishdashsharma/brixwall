import { useQuery } from '@tanstack/react-query';
import { apiGet } from '../../../config/api.js';

const DETAILS_REFRESH_MS = 5000;

const fetchContainer = (containerId) => {
  return apiGet(`/v1/containers/${encodeURIComponent(containerId)}`);
};

const useContainer = (containerId) => useQuery({
  queryKey: ['containers', containerId],
  queryFn: () => fetchContainer(containerId),
  enabled: Boolean(containerId),
  refetchInterval: DETAILS_REFRESH_MS,
});

export { useContainer };
