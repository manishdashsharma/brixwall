import { makeParachute } from '../../../lib/sprites.js';

export default function Parachute({ color, width, delay }) {
  const sprite = makeParachute(color);
  const height = Math.round((width / sprite.width) * sprite.height);

  return (
    <img
      src={sprite.url}
      alt=""
      aria-hidden="true"
      draggable={false}
      width={width}
      height={height}
      className="pixelated pointer-events-none absolute bottom-full left-1/2 animate-parachute"
      style={{ animationDelay: `${delay}ms` }}
    />
  );
}
