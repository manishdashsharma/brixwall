import { useRef } from 'react';
import { useElementSize } from '../../../hooks/useElementSize.js';
import { SPRITES } from '../../../lib/sprites.js';
import { tileStyle } from '../../../lib/tileStyle.js';
import { computeWallLayout, slotPosition } from '../lib/wallLayout.js';
import Brick from './Brick.jsx';
import GhostSlot from './GhostSlot.jsx';
import WallNotice from './WallNotice.jsx';

const STONE_SCALE = 2;

const pillarWidthFor = (width) => Math.round(Math.min(32, Math.max(14, width * 0.03)));

export default function Wall({ bricks, showGhost, notice, selectedId, onSelect, onDropEnd, onFallEnd }) {
  const areaRef = useRef(null);
  const area = useElementSize(areaRef);
  const pillar = pillarWidthFor(area.width);
  const base = Math.round(pillar * 0.9);
  const layout = computeWallLayout({
    width: Math.max(0, area.width - pillar * 2),
    height: Math.max(0, area.height - base - pillar),
    count: bricks.length,
  });
  const ready = area.width > 0;

  return (
    <div ref={areaRef} className="absolute inset-0 flex items-end justify-center">
      {ready && (
        <div
          className="relative"
          style={{ width: layout.wallWidth + pillar * 2, height: layout.wallHeight + base }}
        >
          <div
            aria-hidden="true"
            className="pixelated absolute inset-x-0 top-0 rounded-t-md brightness-[0.6] saturate-50"
            style={{ ...tileStyle(SPRITES.stoneTile, STONE_SCALE), bottom: base }}
          />
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
                onSelect={onSelect}
                onDropEnd={onDropEnd}
                onFallEnd={onFallEnd}
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
