import { cn } from '../../../lib/cn.js';

const TINT_OPACITY = {
  clear: 'opacity-0',
  cloudy: 'opacity-20',
  storm: 'opacity-55',
};

export default function WeatherOverlay({ weather }) {
  const isStorm = weather === 'storm';

  return (
    <div aria-hidden="true">
      <div
        className={cn(
          'pointer-events-none absolute inset-0 z-[8] bg-storm-top transition-opacity duration-[2000ms]',
          TINT_OPACITY[weather]
        )}
      />
      <div
        className={cn(
          'rain pointer-events-none absolute inset-0 z-[25] animate-rain transition-opacity duration-[2000ms]',
          isStorm ? 'opacity-100' : 'opacity-0'
        )}
      />
      {isStorm && (
        <div className="pointer-events-none absolute inset-0 z-[25] bg-white animate-lightning" />
      )}
    </div>
  );
}
