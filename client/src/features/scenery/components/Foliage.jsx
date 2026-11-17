import PixelSprite from '../../../components/ui/PixelSprite.jsx';
import { SPRITES } from '../../../lib/sprites.js';

const TREES = [
  { id: 'tree-a', left: '3%', scale: 6 },
  { id: 'tree-b', left: '14%', scale: 4 },
  { id: 'tree-c', left: '82%', scale: 5 },
  { id: 'tree-d', left: '92%', scale: 7 },
];

const BUSHES = [
  { id: 'bush-a', left: '9%', scale: 4 },
  { id: 'bush-b', left: '27%', scale: 5 },
  { id: 'bush-c', left: '63%', scale: 4 },
  { id: 'bush-d', left: '76%', scale: 5 },
];

const FLOWERS = [
  { id: 'flower-a', left: '6%' },
  { id: 'flower-b', left: '19%' },
  { id: 'flower-c', left: '33%' },
  { id: 'flower-d', left: '68%' },
  { id: 'flower-e', left: '87%' },
];

export default function Foliage() {
  return (
    <div aria-hidden="true">
      {TREES.map((tree) => (
        <div key={tree.id} className="absolute bottom-28 z-[2] hidden sm:block" style={{ left: tree.left }}>
          <PixelSprite sprite={SPRITES.tree} scale={tree.scale} />
        </div>
      ))}
      {BUSHES.map((bush) => (
        <div key={bush.id} className="absolute bottom-28 z-[3]" style={{ left: bush.left }}>
          <PixelSprite sprite={SPRITES.bush} scale={bush.scale} />
        </div>
      ))}
      {FLOWERS.map((flower) => (
        <div key={flower.id} className="absolute bottom-28 z-[6]" style={{ left: flower.left }}>
          <PixelSprite sprite={SPRITES.flower} scale={4} />
        </div>
      ))}
    </div>
  );
}
