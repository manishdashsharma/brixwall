import { cn } from '../../lib/cn.js';
import { SPRITES } from '../../lib/sprites.js';
import Icon from '../ui/Icon.jsx';
import PixelSprite from '../ui/PixelSprite.jsx';
import StatusDot from '../ui/StatusDot.jsx';

const TABS = [
  { id: 'wall', label: 'Wall', icon: 'wall' },
  { id: 'containers', label: 'Containers', icon: 'box' },
  { id: 'logs', label: 'Logs', icon: 'logs' },
];

const HEALTH_TEXT = {
  ok: 'text-ok',
  warn: 'text-warn',
  bad: 'text-bad',
  off: 'text-white/70',
};

export default function TopBar({ activeTab, onTabChange, status }) {
  return (
    <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between gap-2 p-3 sm:p-4">
      <div className="flex items-center gap-2 rounded-2xl bg-hud/95 px-3 py-2 shadow-hud">
        <PixelSprite sprite={SPRITES.crate} scale={3} />
        <span className="hidden text-lg font-black tracking-tight text-white sm:inline">
          Brixwall
        </span>
        <span className="hidden rounded-md bg-violet-500 px-1.5 py-0.5 text-[10px] font-black text-white md:inline">
          BETA
        </span>
      </div>

      <nav aria-label="Views" className="flex gap-1 rounded-2xl bg-hud/95 p-1 shadow-hud">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            aria-pressed={activeTab === tab.id}
            className={cn(
              'flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-extrabold transition',
              activeTab === tab.id
                ? 'bg-white text-hud shadow'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            )}
          >
            <Icon name={tab.icon} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </nav>

      <div
        role="status"
        className="flex items-center gap-2 rounded-2xl bg-hud/95 px-3 py-2.5 shadow-hud"
      >
        <StatusDot tone={status.tone} className="size-2.5" />
        <span className={cn('hidden text-sm font-extrabold md:inline', HEALTH_TEXT[status.tone])}>
          {status.label}
        </span>
      </div>
    </header>
  );
}
