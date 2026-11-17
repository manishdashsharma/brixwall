import Panel from '../../../components/ui/Panel.jsx';
import StatusDot from '../../../components/ui/StatusDot.jsx';
import { brickColorFor } from '../../../lib/brickColors.js';
import { cn } from '../../../lib/cn.js';
import ContainerIconTile from './ContainerIconTile.jsx';
import { containerLabel, containerTone } from '../../../lib/containerStatus.js';

export default function ContainersPanel({ containers, selectedId, onSelect, onClose }) {
  return (
    <Panel
      title={`Containers (${containers.length})`}
      onClose={onClose}
      className="inset-x-3 top-20 max-h-[calc(100dvh-13rem)] sm:inset-x-auto sm:left-4 sm:w-96"
    >
      {containers.length === 0 ? (
        <p className="px-4 py-6 text-sm font-semibold text-white/70">
          No containers to show. Start one and it lands on the wall.
        </p>
      ) : (
        <ul className="min-h-0 flex-1 space-y-1.5 overflow-y-auto p-2">
          {containers.map((container) => (
            <li key={container.id}>
              <button
                type="button"
                onClick={() => onSelect(container.id)}
                aria-pressed={container.id === selectedId}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition',
                  container.id === selectedId ? 'bg-white/15' : 'hover:bg-white/10'
                )}
              >
                <ContainerIconTile container={container} color={brickColorFor(container.name)} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-black">{container.name}</span>
                  <span className="block truncate text-xs font-semibold text-white/60">{container.image}</span>
                </span>
                <span className="flex shrink-0 items-center gap-1.5 text-xs font-extrabold text-white/80">
                  <StatusDot tone={containerTone(container)} className="size-2" />
                  {containerLabel(container)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
