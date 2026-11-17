const STATE_LABELS = {
  exited: 'Stopped',
  created: 'Created',
  paused: 'Paused',
  restarting: 'Restarting',
  removing: 'Removing',
  dead: 'Dead',
};

const HEALTH_LABELS = {
  healthy: 'Healthy',
  unhealthy: 'Unhealthy',
  starting: 'Starting',
};

const containerTone = (container) => {
  if (container.state === 'restarting') {
    return 'warn';
  }
  if (container.state !== 'running') {
    return 'off';
  }
  if (container.health === 'unhealthy') {
    return 'bad';
  }
  if (container.health === 'starting') {
    return 'warn';
  }
  return 'ok';
};

const containerLabel = (container) => {
  if (container.state !== 'running') {
    return STATE_LABELS[container.state] ?? container.state;
  }
  return HEALTH_LABELS[container.health] ?? 'Running';
};

export { containerTone, containerLabel };
