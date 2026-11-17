import PixelSprite from '../../../components/ui/PixelSprite.jsx';
import { cn } from '../../../lib/cn.js';
import { SPRITES } from '../../../lib/sprites.js';
import { useHeroControls } from '../hooks/useHeroControls.js';
import SpeechBubble from './SpeechBubble.jsx';

const GROUND_HEIGHT = 112;
const BUBBLE_GAP = 18;
const POSE_SPRITES = {
  idle: SPRITES.heroIdle,
  walk: SPRITES.heroWalk,
  jump: SPRITES.heroJump,
};

export default function Hero({ sceneWidth, message }) {
  const scale = sceneWidth < 640 ? 3 : 4;
  const heroWidth = SPRITES.heroIdle.width * scale;
  const heroHeight = SPRITES.heroIdle.height * scale;
  const hero = useHeroControls({ sceneWidth, heroWidth });

  if (!hero.ready) {
    return null;
  }

  return (
    <>
      <SpeechBubble
        text={message}
        anchorX={hero.x + heroWidth / 2}
        bottom={GROUND_HEIGHT + heroHeight + hero.y + BUBBLE_GAP}
        sceneWidth={sceneWidth}
        width={sceneWidth < 640 ? 180 : 230}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-20"
        style={{ left: hero.x, bottom: GROUND_HEIGHT + hero.y }}
      >
        <PixelSprite
          sprite={POSE_SPRITES[hero.pose]}
          scale={scale}
          className={cn('drop-shadow-[0_3px_0_rgba(0,0,0,0.25)]', hero.facing < 0 && '-scale-x-100')}
        />
      </div>
    </>
  );
}
