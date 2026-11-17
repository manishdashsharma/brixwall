import Panel from '../../../components/ui/Panel.jsx';
import StatusDot from '../../../components/ui/StatusDot.jsx';
import { brickColorFor } from '../../../lib/brickColors.js';
import { containerLabel, containerTone } from '../../../lib/containerStatus.js';
import { formatPort, formatSince } from '../../../lib/format.js';
import { useContainer } from '../api/useContainer.js';
import DetailRow from './DetailRow.jsx';

export default function ContainerDetails({ containerId, fallbackName, onClose, onViewLogs }) {
  const { data: container, isPending, isError, error, dataUpdatedAt } = useContainer(containerId);
  const name = container?.name ?? fallbackName;
  const color = brickColorFor(name);

  return (
    <Panel
      title="Container"
      onClose={onClose}
      className="inset-x-3 bottom-32 max-h-[60dvh] sm:inset-x-auto sm:right-4 sm:top-20 sm:bottom-auto sm:w-80"
    >
      <div className="h-2" style={{ backgroundColor: color.base }} />
      <div className="overflow-y-auto px-4 pb-4 pt-3">
        <p className="truncate text-xl font-black">{name}</p>

        {isPending && <p className="mt-3 text-sm font-semibold text-white/70">Loading details...</p>}

        {isError && (
          <p role="alert" className="mt-3 rounded-lg bg-bad/20 px-3 py-2 text-sm font-bold text-red-200">
            {error.message}
          </p>
        )}

        {container && (
          <>
            <p className="mt-1 flex items-center gap-2 text-sm font-extrabold">
              <StatusDot tone={containerTone(container)} className="size-2.5" />
              {containerLabel(container)}
            </p>
            <dl className="mt-3 divide-y divide-white/10">
              <DetailRow label="Image">{container.image}</DetailRow>
              <DetailRow label="Started">{formatSince(container.startedAt, dataUpdatedAt)}</DetailRow>
              <DetailRow label="Ports">
                {container.ports.length === 0
                  ? 'None published'
                  : container.ports.map((port) => (
                    <span key={`${port.publicPort}-${port.privatePort}-${port.type}`} className="block">
                      {formatPort(port)}
                    </span>
                  ))}
              </DetailRow>
              <DetailRow label="Networks">{container.networks.join(', ') || 'None'}</DetailRow>
              {container.project && (
                <DetailRow label="Compose">{`${container.project} / ${container.service}`}</DetailRow>
              )}
              <DetailRow label="Restarts">{container.restartCount}</DetailRow>
              {container.state !== 'running' && (
                <DetailRow label="Exit code">{container.exitCode}</DetailRow>
              )}
              <DetailRow label="ID">
                <code className="font-mono text-xs">{container.id}</code>
              </DetailRow>
            </dl>
          </>
        )}

        <button
          type="button"
          onClick={() => onViewLogs(containerId)}
          className="mt-4 w-full rounded-xl bg-white px-4 py-2.5 text-sm font-black text-hud transition hover:bg-white/90"
        >
          View logs
        </button>
      </div>
    </Panel>
  );
}
