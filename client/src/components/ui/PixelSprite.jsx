import { cn } from '../../lib/cn.js';

export default function PixelSprite({ sprite, scale = 1, className, alt = '' }) {
  return (
    <img
      src={sprite.url}
      width={sprite.width * scale}
      height={sprite.height * scale}
      alt={alt}
      draggable={false}
      className={cn('pixelated pointer-events-none select-none', className)}
    />
  );
}
