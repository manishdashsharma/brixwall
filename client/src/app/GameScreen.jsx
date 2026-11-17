import { useCallback, useEffect, useRef } from 'react';
import TopBar from '../components/layout/TopBar.jsx';
import ContainerDetails from '../features/containers/components/ContainerDetails.jsx';
import ContainersPanel from '../features/containers/components/ContainersPanel.jsx';
import LogsPanel from '../features/containers/components/LogsPanel.jsx';
import Hero from '../features/hero/components/Hero.jsx';
import Foliage from '../features/scenery/components/Foliage.jsx';
import Ground from '../features/scenery/components/Ground.jsx';
import Ledge from '../features/scenery/components/Ledge.jsx';
import Sky from '../features/scenery/components/Sky.jsx';
import WeatherOverlay from '../features/scenery/components/WeatherOverlay.jsx';
import Celebration from '../features/wall/components/Celebration.jsx';
import Flag from '../features/wall/components/Flag.jsx';
import Wall from '../features/wall/components/Wall.jsx';
import WallProgress from '../features/wall/components/WallProgress.jsx';
import { useContainerStream } from '../features/wall/hooks/useContainerStream.js';
import { reachableBrick } from '../features/wall/lib/reachableBrick.js';
import { useElementSize } from '../hooks/useElementSize.js';
import { wallStatus } from '../lib/wallStatus.js';
import { useWallStore } from '../store/wall.store.js';

const wallSpanFor = (wallFrame, sceneWidth) => {
  if (!wallFrame) {
    return null;
  }
  return {
    left: sceneWidth / 2 - wallFrame.width / 2,
    right: sceneWidth / 2 + wallFrame.width / 2,
    height: wallFrame.height,
  };
};

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
  const wallFrame = useWallStore((state) => state.wallFrame);
  const celebrationId = useWallStore((state) => state.celebrationId);
  const bumpedId = useWallStore((state) => state.bumpedId);
  const markPlaced = useWallStore((state) => state.markPlaced);
  const removeBrick = useWallStore((state) => state.removeBrick);
  const selectContainer = useWallStore((state) => state.selectContainer);
  const closeDetails = useWallStore((state) => state.closeDetails);
  const setActiveTab = useWallStore((state) => state.setActiveTab);
  const openLogs = useWallStore((state) => state.openLogs);
  const setLogsContainer = useWallStore((state) => state.setLogsContainer);
  const closeAll = useWallStore((state) => state.closeAll);
  const setWallFrame = useWallStore((state) => state.setWallFrame);
  const bumpBrick = useWallStore((state) => state.bumpBrick);
  const clearBump = useWallStore((state) => state.clearBump);

  const status = wallStatus({ hasSnapshot, connection, dockerOnline, dockerMessage, summary });
  const liveContainers = bricks.filter((brick) => brick.phase !== 'falling');
  const selectedBrick = bricks.find((brick) => brick.id === selectedId);
  const showDetails = Boolean(selectedId) && activeTab !== 'logs';

  const handleHeroMove = useCallback((x) => {
    sceneRef.current?.style.setProperty('--hero-x', String(x));
  }, []);

  const handleHeroApex = useCallback((point) => {
    const state = useWallStore.getState();
    const brick = reachableBrick({
      point,
      sceneWidth: sceneRef.current?.clientWidth ?? 0,
      wallFrame: state.wallFrame,
      bricks: state.bricks,
    });
    if (brick) {
      bumpBrick(brick.id);
      selectContainer(brick.id);
    }
  }, [bumpBrick, selectContainer]);

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

      <Sky weather={status.weather} />
      <Foliage />
      <Ledge side="left" className="top-[42%]" />
      <Ledge side="right" className="top-[56%]" />
      <Ground />
      <WeatherOverlay weather={status.weather} />

      <div className="absolute bottom-28 left-1/2 top-48 z-10 w-[calc(100%-1.5rem)] -translate-x-1/2 sm:top-44 md:w-[min(1000px,64%)]">
        <Wall
          bricks={bricks}
          showGhost={hasSnapshot && dockerOnline === true}
          notice={status.notice}
          selectedId={selectedId}
          bumpedId={bumpedId}
          onSelect={selectContainer}
          onDropEnd={markPlaced}
          onFallEnd={removeBrick}
          onBumpEnd={clearBump}
          onFrameChange={setWallFrame}
        />
      </div>

      <Flag raised={summary.allHealthy} />

      {scene.width > 0 && (
        <Hero
          sceneWidth={scene.width}
          message={status.bubble}
          mood={status.mood}
          celebrationId={celebrationId}
          wallSpan={wallSpanFor(wallFrame, scene.width)}
          onMove={handleHeroMove}
          onApex={handleHeroApex}
        />
      )}

      {celebrationId > 0 && <Celebration key={celebrationId} />}

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
