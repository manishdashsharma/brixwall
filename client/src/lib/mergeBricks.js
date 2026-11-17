const FIRST_LOAD_STAGGER_MS = 600;
const FIRST_LOAD_MAX_DELAY_MS = 9000;
const NEW_BRICK_STAGGER_MS = 1000;

const updateBrick = (brick, container) => {
  if (!container) {
    return brick.phase === 'falling' ? brick : { ...brick, phase: 'falling' };
  }
  return {
    ...brick,
    ...container,
    phase: brick.phase === 'falling' ? 'placed' : brick.phase,
  };
};

const dropDelayFor = (index, isFirstSnapshot) => {
  if (isFirstSnapshot) {
    return Math.min(index * FIRST_LOAD_STAGGER_MS, FIRST_LOAD_MAX_DELAY_MS);
  }
  return index * NEW_BRICK_STAGGER_MS;
};

const mergeBricks = (previous, containers, isFirstSnapshot) => {
  const incoming = new Map(containers.map((container) => [container.id, container]));
  const knownIds = new Set(previous.map((brick) => brick.id));

  const updated = previous.map((brick) => updateBrick(brick, incoming.get(brick.id)));
  const added = containers
    .filter((container) => !knownIds.has(container.id))
    .map((container, index) => ({
      ...container,
      phase: 'dropping',
      dropDelay: dropDelayFor(index, isFirstSnapshot),
    }));

  return [...updated, ...added];
};

export { mergeBricks };
