import { useEffect, useRef } from 'react';
import TopBar from '../components/layout/TopBar.jsx';
import ContainerDetails from '../features/containers/components/ContainerDetails.jsx';
import ContainersPanel from '../features/containers/components/ContainersPanel.jsx';
import LogsPanel from '../features/containers/components/LogsPanel.jsx';
import Hero from '../features/hero/components/Hero.jsx';
import Foliage from '../features/scenery/components/Foliage.jsx';
import Ground from '../features/scenery/components/Ground.jsx';
import Ledge from '../features/scenery/components/Ledge.jsx';
import Sky from '../features/scenery/components/Sky.jsx';
import Flag from '../features/wall/components/Flag.jsx';
import Wall from '../features/wall/components/Wall.jsx';
import WallProgress from '../features/wall/components/WallProgress.jsx';
import { useContainerStream } from '../features/wall/hooks/useContainerStream.js';
import { useElementSize } from '../hooks/useElementSize.js';
import { wallStatus } from '../lib/wallStatus.js';
import { useWallStore } from '../store/wall.store.js';

export default function GameScreen() {
  useContainerStream();

  const sceneRef = useRef(null);
  const scene = useElementSize(sceneRef);

  const connection = useWallStore((state) => state.connection);
  const hasSnapshot = useWallStore((state) => state.hasSnapshot);
  const dockerOnline = useWallStore((state) => state.dockerOnline);
  const dockerMessage = useWallStore((state) => state.dockerMessage);
  const summary = useWallStore((state) => state.summary);
  const bricks = useWallStore((state) => state.bricks);
  const selectedId = useWallStore((state) => state.selectedId);
  const activeTab = useWallStore((state) => state.activeTab);
  const logsContainerId = useWallStore((state) => state.logsContainerId);
  const markPlaced = useWallStore((state) => state.markPlaced);
  const removeBrick = useWallStore((state) => state.removeBrick);
  const selectContainer = useWallStore((state) => state.selectContainer);
  const closeDetails = useWallStore((state) => state.closeDetails);
  const setActiveTab = useWallStore((state) => state.setActiveTab);
  const openLogs = useWallStore((state) => state.openLogs);
  const setLogsContainer = useWallStore((state) => state.setLogsContainer);
  const closeAll = useWallStore((state) => state.closeAll);

  const status = wallStatus({ hasSnapshot, connection, dockerOnline, dockerMessage, summary });
  const liveContainers = bricks.filter((brick) => brick.phase !== 'falling');
  const selectedBrick = bricks.find((brick) => brick.id === selectedId);
  const showDetails = Boolean(selectedId) && activeTab !== 'logs';

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeAll();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeAll]);

  return (
    <main ref={sceneRef} className="relative h-dvh w-full overflow-hidden bg-sky-mid font-ui select-none">
      <h1 className="sr-only">Brixwall: your containers as a live brick wall</h1>

      <Sky />
      <Foliage />
      <Ledge side="left" className="top-[42%]" />
      <Ledge side="right" className="top-[56%]" />
      <Ground />

      <div className="absolute bottom-28 left-1/2 top-48 z-10 w-[calc(100%-1.5rem)] -translate-x-1/2 sm:top-44 md:w-[min(1100px,68%)]">
        <Wall
          bricks={bricks}
          showGhost={hasSnapshot && dockerOnline === true}
          notice={status.notice}
          selectedId={selectedId}
          onSelect={selectContainer}
          onDropEnd={markPlaced}
          onFallEnd={removeBrick}
        />
      </div>

      <Flag raised={summary.allHealthy} />

      {scene.width > 0 && <Hero sceneWidth={scene.width} message={status.bubble} />}

      <TopBar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab === activeTab ? 'wall' : tab)}
        status={status}
      />

      {activeTab !== 'containers' && <WallProgress summary={summary} />}

      {activeTab === 'containers' && (
        <ContainersPanel
          containers={liveContainers}
          selectedId={selectedId}
          onSelect={selectContainer}
          onClose={() => setActiveTab('wall')}
        />
      )}

      {activeTab === 'logs' && (
        <LogsPanel
          containers={liveContainers}
          containerId={logsContainerId}
          onSelectContainer={setLogsContainer}
          onClose={() => setActiveTab('wall')}
        />
      )}

      {showDetails && (
        <ContainerDetails
          key={selectedId}
          containerId={selectedId}
          fallbackName={selectedBrick?.name ?? selectedId}
          onClose={closeDetails}
          onViewLogs={openLogs}
        />
      )}
    </main>
  );
}
