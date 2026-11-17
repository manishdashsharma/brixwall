const attentionLabel = (count) => `${count} need${count === 1 ? 's' : ''} attention`;

const wallStatus = ({ hasSnapshot, connection, dockerOnline, dockerMessage, summary }) => {
  if (!hasSnapshot && connection === 'reconnecting') {
    return {
      tone: 'bad',
      label: 'Server offline',
      bubble: 'I can\'t reach the Brixwall server. Is it running?',
      notice: {
        title: 'Can\'t reach the Brixwall server',
        body: 'Start the server and this page reconnects on its own.',
      },
    };
  }
  if (!hasSnapshot) {
    return { tone: 'off', label: 'Connecting', bubble: 'Spinning up the wall...', notice: null };
  }
  if (connection === 'reconnecting') {
    return { tone: 'warn', label: 'Reconnecting', bubble: 'Lost the server. Reconnecting...', notice: null };
  }
  if (!dockerOnline) {
    return {
      tone: 'bad',
      label: 'Docker offline',
      bubble: 'Docker is asleep. Wake it up and I\'ll rebuild!',
      notice: {
        title: 'Docker is not running',
        body: dockerMessage || 'Start Docker and the wall rebuilds itself.',
      },
    };
  }
  if (summary.total === 0) {
    return {
      tone: 'off',
      label: 'No containers',
      bubble: 'No containers yet. Start one and watch it land!',
      notice: {
        title: 'No containers yet',
        body: 'Start a container, or run test/spawn.sh to drop in some samples.',
      },
    };
  }
  if (summary.allHealthy) {
    return { tone: 'ok', label: 'All healthy', bubble: 'All healthy! Flag is up!', notice: null };
  }
  return {
    tone: 'warn',
    label: attentionLabel(summary.total - summary.healthy),
    bubble: `${summary.healthy} of ${summary.total} healthy. Keep building!`,
    notice: null,
  };
};

export { wallStatus };
