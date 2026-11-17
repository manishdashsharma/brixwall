const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3600;
const SECONDS_PER_DAY = 86400;

const formatClock = (iso) => {
  if (!iso) {
    return '';
  }
  return new Date(iso).toLocaleTimeString([], { hour12: false });
};

const formatSince = (iso, now) => {
  if (!iso) {
    return 'Never';
  }
  const seconds = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000));
  if (seconds < SECONDS_PER_MINUTE) {
    return `${seconds}s ago`;
  }
  if (seconds < SECONDS_PER_HOUR) {
    return `${Math.floor(seconds / SECONDS_PER_MINUTE)}m ago`;
  }
  if (seconds < SECONDS_PER_DAY) {
    return `${Math.floor(seconds / SECONDS_PER_HOUR)}h ago`;
  }
  return `${Math.floor(seconds / SECONDS_PER_DAY)}d ago`;
};

const formatPort = (port) => `${port.publicPort} → ${port.privatePort}/${port.type}`;

export { formatClock, formatSince, formatPort };
