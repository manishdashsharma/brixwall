import { create } from 'zustand';
import { mergeBricks } from '../lib/mergeBricks.js';

const EMPTY_SUMMARY = { total: 0, running: 0, healthy: 0, allHealthy: false };

const isSameFrame = (first, second) => {
  return Boolean(first)
    && first.width === second.width
    && first.height === second.height
    && first.base === second.base
    && first.pillar === second.pillar
    && first.layout.columns === second.layout.columns
    && first.layout.brickWidth === second.layout.brickWidth
    && first.layout.brickHeight === second.layout.brickHeight;
};

const useWallStore = create((set) => ({
  connection: 'connecting',
  hasSnapshot: false,
  dockerOnline: null,
  dockerMessage: null,
  summary: EMPTY_SUMMARY,
  bricks: [],
  selectedId: null,
  activeTab: 'wall',
  logsContainerId: null,
  wallFrame: null,
  celebrationId: 0,
  bumpedId: null,

  applySnapshot: (snapshot) => set((state) => ({
    hasSnapshot: true,
    dockerOnline: snapshot.dockerOnline,
    dockerMessage: snapshot.message,
    summary: snapshot.summary,
    bricks: mergeBricks(state.bricks, snapshot.containers, !state.hasSnapshot),
    celebrationId: snapshot.summary.allHealthy && !state.summary.allHealthy
      ? state.celebrationId + 1
      : state.celebrationId,
  })),

  setConnection: (connection) => set({ connection }),

  setWallFrame: (wallFrame) => set((state) => (
    isSameFrame(state.wallFrame, wallFrame) ? state : { wallFrame }
  )),

  markPlaced: (id) => set((state) => ({
    bricks: state.bricks.map((brick) => (
      brick.id === id && brick.phase === 'dropping' ? { ...brick, phase: 'placed' } : brick
    )),
  })),

  removeBrick: (id) => set((state) => ({
    bricks: state.bricks.filter((brick) => !(brick.id === id && brick.phase === 'falling')),
  })),

  bumpBrick: (bumpedId) => set({ bumpedId }),

  clearBump: () => set({ bumpedId: null }),

  selectContainer: (selectedId) => set((state) => ({
    selectedId,
    activeTab: state.activeTab === 'logs' ? 'wall' : state.activeTab,
  })),

  closeDetails: () => set({ selectedId: null }),

  setActiveTab: (activeTab) => set({ activeTab }),

  openLogs: (logsContainerId) => set({ activeTab: 'logs', logsContainerId }),

  setLogsContainer: (logsContainerId) => set({ logsContainerId }),

  closeAll: () => set({ activeTab: 'wall', selectedId: null }),
}));

export { useWallStore };
