import PixelSprite from '../../../components/ui/PixelSprite.jsx';
import { cn } from '../../../lib/cn.js';

export default function DriftingSprite({ item, sprite, className }) {
  return (
    <div
      className={cn('absolute left-0 animate-drift', className)}
      style={{ top: item.top, animationDuration: `${item.duration}s`, animationDelay: `${item.delay}s` }}
    >
      <PixelSprite sprite={sprite} scale={item.scale ?? 3} />
    </div>
  );
}
