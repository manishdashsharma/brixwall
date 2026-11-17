import PixelSprite from '../../../components/ui/PixelSprite.jsx';
import { SPRITES } from '../../../lib/sprites.js';

const CLOUDS = [
  { id: 'cloud-a', top: '14%', scale: 6, duration: 140, delay: -20 },
  { id: 'cloud-b', top: '24%', scale: 4, duration: 110, delay: -75 },
  { id: 'cloud-c', top: '9%', scale: 5, duration: 170, delay: -120 },
  { id: 'cloud-d', top: '34%', scale: 3, duration: 95, delay: -40 },
  { id: 'cloud-e', top: '19%', scale: 7, duration: 210, delay: -160 },
];

const BIRDS = [
  { id: 'bird-a', top: '16%', duration: 48, delay: -8 },
  { id: 'bird-b', top: '13%', duration: 52, delay: -12 },
  { id: 'bird-c', top: '18%', duration: 50, delay: -30 },
];

export default function Sky() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-linear-to-b from-sky-top via-sky-mid to-sky-low">
      {CLOUDS.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute left-0 animate-drift opacity-95"
          style={{
            top: cloud.top,
            animationDuration: `${cloud.duration}s`,
            animationDelay: `${cloud.delay}s`,
          }}
        >
          <PixelSprite sprite={SPRITES.cloud} scale={cloud.scale} />
        </div>
      ))}

      {BIRDS.map((bird) => (
        <div
          key={bird.id}
          className="absolute left-0 animate-drift"
          style={{
            top: bird.top,
            animationDuration: `${bird.duration}s`,
            animationDelay: `${bird.delay}s`,
          }}
        >
          <PixelSprite sprite={SPRITES.bird} scale={3} className="animate-bob" />
        </div>
      ))}

      <div className="absolute bottom-28 -left-[10%] h-[34vh] w-[55vw] rounded-t-[50%] bg-hill-far" />
      <div className="absolute bottom-28 left-[30%] h-[42vh] w-[60vw] rounded-t-[50%] bg-hill-far" />
      <div className="absolute bottom-28 -right-[15%] h-[30vh] w-[50vw] rounded-t-[50%] bg-hill-far" />
      <div className="absolute bottom-28 -left-[5%] h-[20vh] w-[45vw] rounded-t-[50%] bg-hill-near" />
      <div className="absolute bottom-28 left-[45%] h-[16vh] w-[40vw] rounded-t-[50%] bg-hill-near" />
      <div className="absolute bottom-28 -right-[8%] h-[22vh] w-[35vw] rounded-t-[50%] bg-hill-near" />
    </div>
  );
}
