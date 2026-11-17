const ICON_PATHS = {
  wall: 'M3 5h18v4H3zM3 9h9v5H3zM12 9h9v5h-9zM3 14h18v5H3zM8 14v5M16 5v4',
  box: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10',
  logs: 'M5 3h10l4 4v14H5zM14 3v5h5M8 12h8M8 16h8M8 8h3',
  close: 'M6 6l12 12M18 6L6 18',
  keys: 'M3 8h18v10H3zM7 12h1M11 12h2M16 12h1M8 15h8',
};

export default function Icon({ name, className = 'size-4' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}
