import { useEffect, useRef } from 'react';
import { useElementSize } from '../../../hooks/useElementSize.js';
import { SPRITES } from '../../../lib/sprites.js';
import { tileStyle } from '../../../lib/tileStyle.js';
import { computeWallLayout, slotPosition } from '../lib/wallLayout.js';
import Brick from './Brick.jsx';
import GhostSlot from './GhostSlot.jsx';
import WallNotice from './WallNotice.jsx';

const STONE_SCALE = 2;
const GRASS_CAP_HEIGHT = 10;

const pillarWidthFor = (width) => Math.round(Math.min(28, Math.max(14, width * 0.025)));

export default function Wall({
  bricks,
  showGhost,
  notice,
  selectedId,
  bumpedId,
  onSelect,
  onDropEnd,
  onFallEnd,
  onBumpEnd,
  onFrameChange,
}) {
  const areaRef = useRef(null);
  const area = useElementSize(areaRef);
  const pillar = pillarWidthFor(area.width);
  const base = Math.round(pillar * 0.9);
  const layout = computeWallLayout({
    width: Math.max(0, area.width - pillar * 2),
    height: Math.max(0, area.height - base - pillar - GRASS_CAP_HEIGHT),
    count: bricks.length,
  });
  const frameWidth = layout.wallWidth + pillar * 2;
  const frameHeight = layout.wallHeight + base;
  const ready = area.width > 0;

  useEffect(() => {
    if (ready) {
      onFrameChange({
        width: frameWidth,
        height: frameHeight + pillar + GRASS_CAP_HEIGHT,
        base,
        pillar,
        layout: {
          columns: layout.columns,
          brickWidth: layout.brickWidth,
          brickHeight: layout.brickHeight,
        },
      });
    }
  }, [
    ready,
    frameWidth,
    frameHeight,
    base,
    pillar,
    layout.columns,
    layout.brickWidth,
    layout.brickHeight,
    onFrameChange,
  ]);

  return (
    <div ref={areaRef} className="absolute inset-0 flex items-end justify-center">
      {ready && (
        <div className="relative" style={{ width: frameWidth, height: frameHeight }}>
          <div
            aria-hidden="true"
            className="pixelated absolute inset-x-0 top-0 rounded-t-md brightness-[0.6] saturate-50"
            style={{ ...tileStyle(SPRITES.stoneTile, STONE_SCALE), bottom: base }}
          >
            <div
              className="pixelated absolute inset-x-0 bottom-full h-2.5"
              style={tileStyle(SPRITES.grassTile, 1.25)}
            />
          </div>
          {['left-0', 'right-0'].map((side) => (
            <div
              key={side}
              aria-hidden="true"
              className={`pixelated absolute bottom-0 ${side} border-x-2 border-stone-edge`}
              style={{ ...tileStyle(SPRITES.stoneTile, STONE_SCALE), width: pillar, top: -pillar }}
            >
              <div
                className="pixelated absolute inset-x-[-4px] top-[-10px] h-3 rounded-t-sm"
                style={tileStyle(SPRITES.grassTile, 1.5)}
              />
            </div>
          ))}
          <div
            aria-hidden="true"
            className="pixelated absolute inset-x-0 bottom-0 border-t-2 border-stone-edge"
            style={{ ...tileStyle(SPRITES.stoneTile, STONE_SCALE), height: base }}
          />

          <div
            className="absolute"
            style={{ left: pillar, bottom: base, width: layout.wallWidth, height: layout.wallHeight }}
          >
            {bricks.map((brick, index) => (
              <Brick
                key={brick.id}
                brick={brick}
                position={slotPosition(index, layout)}
                width={layout.brickWidth}
                height={layout.brickHeight}
                isSelected={brick.id === selectedId}
                isBumped={brick.id === bumpedId}
                onSelect={onSelect}
                onDropEnd={onDropEnd}
                onFallEnd={onFallEnd}
                onBumpEnd={onBumpEnd}
              />
            ))}
            {showGhost && (
              <GhostSlot
                position={slotPosition(bricks.length, layout)}
                width={layout.brickWidth}
                height={layout.brickHeight}
              />
            )}
          </div>
        </div>
      )}
      {notice && <WallNotice title={notice.title} body={notice.body} />}
    </div>
  );
}
