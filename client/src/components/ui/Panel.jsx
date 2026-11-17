import { cn } from '../../lib/cn.js';
import Icon from './Icon.jsx';

export default function Panel({ title, onClose, className, headerExtra, children }) {
  return (
    <section
      aria-label={title}
      className={cn(
        'absolute z-40 flex flex-col overflow-hidden rounded-2xl border-4 border-hud-edge',
        'bg-hud/95 text-white shadow-hud backdrop-blur-sm',
        className
      )}
    >
      <header className="flex items-center gap-3 border-b-2 border-white/10 px-4 py-3">
        <h2 className="font-pixel text-[11px] leading-none tracking-wide text-white">{title}</h2>
        <div className="ml-auto flex items-center gap-2">
          {headerExtra}
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title}`}
            className="rounded-lg p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
          >
            <Icon name="close" />
          </button>
        </div>
      </header>
      {children}
    </section>
  );
}
