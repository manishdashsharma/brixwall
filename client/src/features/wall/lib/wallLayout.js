const MAX_BRICK_WIDTH = 168;
const MIN_BRICK_WIDTH = 72;
const BRICK_RATIO = 0.36;
const MIN_COLUMNS = 2;
const PREFERRED_MAX_COLUMNS = 6;
const MAX_COLUMNS = 12;
const MIN_SLOTS = 4;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const sizeFor = (width, columns) => {
  const brickWidth = clamp(Math.floor(width / (columns + 0.5)), MIN_BRICK_WIDTH, MAX_BRICK_WIDTH);
  return { brickWidth, brickHeight: Math.round(brickWidth * BRICK_RATIO) };
};

const computeWallLayout = ({ width, height, count }) => {
  const slots = Math.max(count + 1, MIN_SLOTS);
  const columnsByWidth = clamp(Math.floor(width / MAX_BRICK_WIDTH), MIN_COLUMNS, PREFERRED_MAX_COLUMNS);
  let columns = clamp(slots, MIN_COLUMNS, columnsByWidth);
  let size = sizeFor(width, columns);

  while (Math.ceil(slots / columns) * size.brickHeight > height && columns < MAX_COLUMNS) {
    columns += 1;
    size = sizeFor(width, columns);
  }

  const rows = Math.ceil(slots / columns);
  return {
    columns,
    rows,
    brickWidth: size.brickWidth,
    brickHeight: size.brickHeight,
    wallWidth: Math.round(size.brickWidth * (columns + (rows > 1 ? 0.5 : 0))),
    wallHeight: rows * size.brickHeight,
  };
};

const slotPosition = (index, layout) => {
  const row = Math.floor(index / layout.columns);
  const column = index % layout.columns;
  const offset = row % 2 === 1 ? layout.brickWidth / 2 : 0;
  return {
    left: column * layout.brickWidth + offset,
    bottom: row * layout.brickHeight,
  };
};

export { computeWallLayout, slotPosition };
