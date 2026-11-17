import { useEffect } from 'react';
import { streamUrl } from '../../../config/api.js';
import { useWallStore } from '../../../store/wall.store.js';

const useContainerStream = () => {
  const applySnapshot = useWallStore((state) => state.applySnapshot);
  const setConnection = useWallStore((state) => state.setConnection);

  useEffect(() => {
    const source = new EventSource(streamUrl('/v1/containers/stream'));

    const handleSnapshot = (event) => {
      applySnapshot(JSON.parse(event.data));
    };

    source.onopen = () => setConnection('live');
    source.onerror = () => setConnection('reconnecting');
    source.addEventListener('snapshot', handleSnapshot);

    return () => {
      source.removeEventListener('snapshot', handleSnapshot);
      source.close();
    };
  }, [applySnapshot, setConnection]);
};

export { useContainerStream };
