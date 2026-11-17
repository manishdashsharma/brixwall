import PixelSprite from '../../../components/ui/PixelSprite.jsx';
import { cn } from '../../../lib/cn.js';
import { SPRITES } from '../../../lib/sprites.js';
import DriftingSprite from './DriftingSprite.jsx';

const CLOUDS = [
  { id: 'cloud-a', top: '14%', scale: 6, duration: 140, delay: -20 },
  { id: 'cloud-b', top: '24%', scale: 4, duration: 110, delay: -75 },
  { id: 'cloud-c', top: '9%', scale: 5, duration: 170, delay: -120 },
  { id: 'cloud-d', top: '34%', scale: 3, duration: 95, delay: -40 },
  { id: 'cloud-e', top: '19%', scale: 7, duration: 210, delay: -160 },
];

const STORM_CLOUDS = [
  { id: 'storm-a', top: '6%', scale: 9, duration: 90, delay: -10 },
  { id: 'storm-b', top: '15%', scale: 7, duration: 75, delay: -50 },
  { id: 'storm-c', top: '3%', scale: 10, duration: 110, delay: -80 },
  { id: 'storm-d', top: '22%', scale: 6, duration: 65, delay: -30 },
  { id: 'storm-e', top: '10%', scale: 8, duration: 100, delay: -95 },
];

const BIRDS = [
  { id: 'bird-a', top: '16%', duration: 48, delay: -8 },
  { id: 'bird-b', top: '13%', duration: 52, delay: -12 },
  { id: 'bird-c', top: '18%', duration: 50, delay: -30 },
];

const STARS = [
  { id: 'star-a', top: '8%', left: '12%' },
  { id: 'star-b', top: '14%', left: '27%' },
  { id: 'star-c', top: '6%', left: '44%' },
  { id: 'star-d', top: '18%', left: '58%' },
  { id: 'star-e', top: '9%', left: '71%' },
  { id: 'star-f', top: '21%', left: '86%' },
  { id: 'star-g', top: '27%', left: '35%' },
  { id: 'star-h', top: '4%', left: '92%' },
];

const SKY_LAYERS = {
  clear: 'from-sky-top via-sky-mid to-sky-low',
  cloudy: 'from-cloudy-top via-cloudy-mid to-cloudy-low',
  storm: 'from-storm-top via-storm-mid to-storm-low',
};

const visibleWhen = (active) => (active ? 'opacity-100' : 'opacity-0');

export default function Sky({ weather }) {
  const isClear = weather === 'clear';
  const isStorm = weather === 'storm';

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {Object.entries(SKY_LAYERS).map(([name, gradient]) => (
        <div
          key={name}
          className={cn(
            'absolute inset-0 bg-linear-to-b transition-opacity duration-[2000ms]',
            gradient,
            visibleWhen(weather === name)
          )}
        />
      ))}

      <div className={cn('transition-opacity duration-[2000ms]', visibleWhen(isStorm))}>
        {STARS.map((star) => (
          <span
            key={star.id}
            className="absolute size-1 bg-white animate-pulse"
            style={{ top: star.top, left: star.left }}
          />
        ))}
      </div>

      <div
        className={cn(
          'absolute right-[16%] top-[9%] transition-all duration-[2000ms] drop-shadow-[0_0_24px_rgba(255,216,74,0.8)]',
          isClear ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        )}
      >
        <PixelSprite sprite={SPRITES.sun} scale={6} />
      </div>
      <div
        className={cn(
          'absolute left-[20%] top-[8%] transition-all duration-[2000ms] drop-shadow-[0_0_18px_rgba(238,242,255,0.6)]',
          isStorm ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        )}
      >
        <PixelSprite sprite={SPRITES.moon} scale={5} />
      </div>

      <div className={cn('transition-opacity duration-[2000ms]', isClear ? 'opacity-95' : 'opacity-40')}>
        {CLOUDS.map((cloud) => (
          <DriftingSprite key={cloud.id} item={cloud} sprite={SPRITES.cloud} />
        ))}
      </div>
      <div className={cn('transition-opacity duration-[2000ms]', visibleWhen(!isClear))}>
        {STORM_CLOUDS.map((cloud) => (
          <DriftingSprite key={cloud.id} item={cloud} sprite={SPRITES.stormCloud} />
        ))}
      </div>
      <div className={cn('transition-opacity duration-[2000ms]', visibleWhen(isClear))}>
        {BIRDS.map((bird) => (
          <DriftingSprite key={bird.id} item={bird} sprite={SPRITES.bird} />
        ))}
      </div>

      <div className="absolute inset-x-[-10%] bottom-28 h-[46vh] translate-x-[calc(var(--hero-x,0)*-0.015px)]">
        <div className="absolute bottom-0 left-[2%] h-full w-[34%] bg-mountain [clip-path:polygon(0_100%,48%_8%,58%_22%,66%_14%,100%_100%)]" />
        <div className="absolute bottom-0 left-[38%] h-[80%] w-[30%] bg-mountain [clip-path:polygon(0_100%,52%_0,100%_100%)]" />
        <div className="absolute bottom-0 right-[2%] h-[92%] w-[36%] bg-mountain [clip-path:polygon(0_100%,34%_18%,44%_6%,60%_30%,100%_100%)]" />
      </div>

      <div className="absolute inset-x-0 bottom-28 h-[42vh] translate-x-[calc(var(--hero-x,0)*-0.03px)]">
        <div className="absolute bottom-0 -left-[10%] h-[80%] w-[55vw] rounded-t-[50%] bg-hill-far" />
        <div className="absolute bottom-0 left-[30%] h-full w-[60vw] rounded-t-[50%] bg-hill-far" />
        <div className="absolute bottom-0 -right-[15%] h-[72%] w-[50vw] rounded-t-[50%] bg-hill-far" />
      </div>

      <div className="absolute inset-x-0 bottom-28 h-[22vh] translate-x-[calc(var(--hero-x,0)*-0.06px)]">
        <div className="absolute bottom-0 -left-[8%] h-[90%] w-[45vw] rounded-t-[50%] bg-hill-near" />
        <div className="absolute bottom-0 left-[45%] h-[72%] w-[40vw] rounded-t-[50%] bg-hill-near" />
        <div className="absolute bottom-0 -right-[10%] h-full w-[35vw] rounded-t-[50%] bg-hill-near" />
      </div>
    </div>
  );
}
