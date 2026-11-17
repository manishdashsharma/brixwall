const BRICK_COLORS = [
  { base: '#f28b30', dark: '#b9591a' },
  { base: '#8b5cf6', dark: '#5b34c2' },
  { base: '#ec4899', dark: '#b02d6c' },
  { base: '#22a55a', dark: '#14743d' },
  { base: '#2f6fde', dark: '#1d4aa3' },
  { base: '#eab308', dark: '#a87e04' },
  { base: '#14b8a6', dark: '#0b8476' },
  { base: '#e5533d', dark: '#a93726' },
];

const hashName = (name) => {
  return [...name].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) % 100003, 7);
};

const brickColorFor = (name) => BRICK_COLORS[hashName(name) % BRICK_COLORS.length];

export { brickColorFor };
