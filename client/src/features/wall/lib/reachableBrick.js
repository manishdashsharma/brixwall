import { slotPosition } from './wallLayout.js';

const reachableBrick = ({ point, sceneWidth, wallFrame, bricks }) => {
  if (!wallFrame) {
    return null;
  }
  const originLeft = sceneWidth / 2 - wallFrame.width / 2 + wallFrame.pillar;
  const { layout } = wallFrame;

  const candidates = bricks
    .map((brick, index) => ({ brick, position: slotPosition(index, layout) }))
    .filter(({ brick, position }) => {
      const left = originLeft + position.left;
      const bottom = wallFrame.base + position.bottom;
      return brick.phase === 'placed'
        && point.x >= left
        && point.x <= left + layout.brickWidth
        && bottom <= point.y;
    })
    .sort((first, second) => second.position.bottom - first.position.bottom);

  return candidates[0]?.brick ?? null;
};

export { reachableBrick };
