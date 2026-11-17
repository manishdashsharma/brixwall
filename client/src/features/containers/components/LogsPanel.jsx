import { useEffect, useRef } from 'react';
import Panel from '../../../components/ui/Panel.jsx';
import { cn } from '../../../lib/cn.js';
import { formatClock } from '../../../lib/format.js';
import { useContainerLogs } from '../api/useContainerLogs.js';

const TAIL = 200;

export default function LogsPanel({ containers, containerId, onSelectContainer, onClose }) {
  const activeId = containerId ?? containers[0]?.id ?? null;
  const { data: logs, isPending, isError, error } = useContainerLogs(activeId, TAIL);
  const listRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    if (list) {
      list.scrollTop = list.scrollHeight;
    }
  }, [logs]);

  const picker = containers.length > 0 && (
    <select
      value={activeId ?? ''}
      onChange={(event) => onSelectContainer(event.target.value)}
      aria-label="Container"
      className="max-w-44 rounded-lg border-2 border-white/20 bg-hud px-2 py-1 text-xs font-bold text-white"
    >
      {containers.map((container) => (
        <option key={container.id} value={container.id}>{container.name}</option>
      ))}
    </select>
  );

  return (
    <Panel
      title="Logs"
      onClose={onClose}
      headerExtra={picker}
      className="inset-x-3 top-20 bottom-32 sm:inset-x-auto sm:right-4 sm:w-[min(640px,calc(100%-2rem))]"
    >
      {!activeId && (
        <p className="px-4 py-6 text-sm font-semibold text-white/70">No containers to read logs from.</p>
      )}
      {activeId && isPending && (
        <p className="px-4 py-6 text-sm font-semibold text-white/70">Loading logs...</p>
      )}
      {activeId && isError && (
        <p role="alert" className="m-4 rounded-lg bg-bad/20 px-3 py-2 text-sm font-bold text-red-200">
          {error.message}
        </p>
      )}
      {logs && logs.length === 0 && (
        <p className="px-4 py-6 text-sm font-semibold text-white/70">This container has not logged anything yet.</p>
      )}
      {logs && logs.length > 0 && (
        <ol ref={listRef} className="flex-1 overflow-y-auto bg-black/30 px-4 py-3 font-mono text-xs leading-relaxed">
          {logs.map((line, index) => (
            <li
              key={`${line.timestamp}-${index}`}
              className={cn('flex gap-3 break-all', line.stream === 'stderr' ? 'text-rose-200/90' : 'text-white/85')}
            >
              <span className="shrink-0 text-white/40">{formatClock(line.timestamp)}</span>
              <span>{line.message}</span>
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
}
