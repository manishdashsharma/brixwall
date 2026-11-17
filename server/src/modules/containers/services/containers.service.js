import config from '../../../config/index.js';
import { dockerRequest, logger } from '../../../shared/index.js';

const HEALTH_PATTERN = /\((healthy|unhealthy|health: starting)\)/;
const DOCKER_ZERO_TIME = '0001-01-01T00:00:00Z';
const SHORT_ID_LENGTH = 12;
const FRAME_HEADER_SIZE = 8;
const STDERR_STREAM = 2;

const subscribers = new Set();
let watching = false;
let pollTimer = null;
let lastSignature = null;
let lastSnapshot = null;

const readHealthFromStatus = (status) => {
  const match = status.match(HEALTH_PATTERN);
  if (!match) {
    return null;
  }
  return match[1] === 'health: starting' ? 'starting' : match[1];
};

const toListPorts = (ports = []) => {
  const unique = new Map();
  ports
    .filter((port) => port.PublicPort)
    .forEach((port) => {
      const key = `${port.PublicPort}:${port.PrivatePort}/${port.Type}`;
      unique.set(key, {
        publicPort: port.PublicPort,
        privatePort: port.PrivatePort,
        type: port.Type,
      });
    });
  return [...unique.values()];
};

const toInspectPorts = (ports = {}) => {
  const unique = new Map();
  Object.entries(ports ?? {}).forEach(([binding, hosts]) => {
    const [privatePort, type] = binding.split('/');
    (hosts ?? []).forEach((host) => {
      const key = `${host.HostPort}:${privatePort}/${type}`;
      unique.set(key, {
        publicPort: Number(host.HostPort),
        privatePort: Number(privatePort),
        type,
      });
    });
  });
  return [...unique.values()];
};

const toTimestamp = (value) => (value && value !== DOCKER_ZERO_TIME ? value : null);

const toContainer = (raw) => ({
  id: raw.Id.slice(0, SHORT_ID_LENGTH),
  name: (raw.Names?.[0] ?? raw.Id).replace(/^\//, ''),
  image: raw.Image,
  state: raw.State,
  status: raw.Status,
  health: readHealthFromStatus(raw.Status ?? ''),
  ports: toListPorts(raw.Ports),
  project: raw.Labels?.['com.docker.compose.project'] ?? null,
  service: raw.Labels?.['com.docker.compose.service'] ?? null,
  createdAt: new Date(raw.Created * 1000).toISOString(),
});

const isHealthy = (container) => {
  return container.state === 'running'
    && (container.health === null || container.health === 'healthy');
};

const summarize = (containers) => {
  const running = containers.filter((container) => container.state === 'running').length;
  const healthy = containers.filter(isHealthy).length;
  return {
    total: containers.length,
    running,
    healthy,
    allHealthy: containers.length > 0 && healthy === containers.length,
  };
};

const splitLogLine = (stream, line) => {
  const separator = line.indexOf(' ');
  return {
    stream,
    timestamp: separator > 0 ? line.slice(0, separator) : null,
    message: separator > 0 ? line.slice(separator + 1) : line,
  };
};

const toLogLines = (stream, text) => {
  return text
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line) => splitLogLine(stream, line));
};

const demultiplexLogs = (buffer) => {
  const lines = [];
  let offset = 0;
  while (offset + FRAME_HEADER_SIZE <= buffer.length) {
    const stream = buffer[offset] === STDERR_STREAM ? 'stderr' : 'stdout';
    const size = buffer.readUInt32BE(offset + 4);
    const start = offset + FRAME_HEADER_SIZE;
    lines.push(...toLogLines(stream, buffer.subarray(start, start + size).toString('utf8')));
    offset = start + size;
  }
  return lines;
};

const listContainersService = async () => {
  const raw = await dockerRequest('/containers/json', { query: { all: 1 } });
  const containers = raw
    .map(toContainer)
    .sort((first, second) => first.createdAt.localeCompare(second.createdAt));

  return { containers, summary: summarize(containers) };
};

const getContainerService = async (containerId) => {
  const raw = await dockerRequest(`/containers/${encodeURIComponent(containerId)}/json`);

  return {
    id: raw.Id.slice(0, SHORT_ID_LENGTH),
    name: raw.Name.replace(/^\//, ''),
    image: raw.Config?.Image ?? null,
    state: raw.State?.Status ?? null,
    health: raw.State?.Health?.Status ?? null,
    exitCode: raw.State?.ExitCode ?? null,
    restartCount: raw.RestartCount ?? 0,
    ports: toInspectPorts(raw.NetworkSettings?.Ports),
    networks: Object.keys(raw.NetworkSettings?.Networks ?? {}),
    project: raw.Config?.Labels?.['com.docker.compose.project'] ?? null,
    service: raw.Config?.Labels?.['com.docker.compose.service'] ?? null,
    createdAt: toTimestamp(raw.Created),
    startedAt: toTimestamp(raw.State?.StartedAt),
    finishedAt: toTimestamp(raw.State?.FinishedAt),
  };
};

const getContainerLogsService = async (containerId, { tail }) => {
  const encodedId = encodeURIComponent(containerId);
  const inspect = await dockerRequest(`/containers/${encodedId}/json`);
  const buffer = await dockerRequest(`/containers/${encodedId}/logs`, {
    query: { stdout: 1, stderr: 1, timestamps: 1, tail },
    raw: true,
  });

  if (inspect.Config?.Tty) {
    return toLogLines('stdout', buffer.toString('utf8'));
  }
  return demultiplexLogs(buffer);
};

const offlineSnapshot = (message) => ({
  dockerOnline: false,
  message,
  containers: [],
  summary: summarize([]),
});

const readSnapshot = async () => {
  try {
    const result = await listContainersService();
    return { dockerOnline: true, message: null, ...result };
  } catch (error) {
    if (error.statusCode === 503) {
      return offlineSnapshot(error.message);
    }
    logger.error('Container poll failed', { error: error.message, stack: error.stack });
    return lastSnapshot ?? offlineSnapshot('Could not read containers from Docker');
  }
};

const signatureOf = (snapshot) => {
  return JSON.stringify([
    snapshot.dockerOnline,
    snapshot.containers.map((container) => [
      container.id,
      container.name,
      container.state,
      container.health,
    ]),
  ]);
};

const logDockerTransition = (snapshot) => {
  if (lastSnapshot?.dockerOnline === snapshot.dockerOnline) {
    return;
  }
  if (snapshot.dockerOnline) {
    logger.info('Docker is reachable', { containers: snapshot.summary.total });
  } else {
    logger.warn('Docker is unreachable', { reason: snapshot.message });
  }
};

const pollContainers = async () => {
  const snapshot = await readSnapshot();
  const signature = signatureOf(snapshot);

  if (signature !== lastSignature) {
    logDockerTransition(snapshot);
    lastSignature = signature;
    lastSnapshot = snapshot;
    subscribers.forEach((listener) => listener(snapshot));
  }

  if (subscribers.size > 0) {
    pollTimer = setTimeout(pollContainers, config.docker.pollIntervalMs);
    return;
  }

  watching = false;
  pollTimer = null;
  lastSignature = null;
  lastSnapshot = null;
};

const subscribeContainersService = (listener) => {
  subscribers.add(listener);

  if (lastSnapshot) {
    listener(lastSnapshot);
  }

  if (!watching) {
    watching = true;
    pollContainers();
  }

  return () => {
    subscribers.delete(listener);
  };
};

const stopContainersWatchService = () => {
  subscribers.clear();
  clearTimeout(pollTimer);
  watching = false;
  pollTimer = null;
  lastSignature = null;
  lastSnapshot = null;
};

export {
  listContainersService,
  getContainerService,
  getContainerLogsService,
  subscribeContainersService,
  stopContainersWatchService,
};
