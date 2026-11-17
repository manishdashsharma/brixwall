const hashString = (value) => {
  return [...value].reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) % 100003, 7);
};

export { hashString };
