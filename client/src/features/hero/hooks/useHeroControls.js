import { useEffect, useRef, useState } from 'react';

const SPEED = 260;
const GRAVITY = 2600;
const JUMP_VELOCITY = 880;
const STEP_MS = 140;
const MAX_FRAME_SECONDS = 0.05;
const START_RATIO = 0.06;
const LEFT_KEYS = ['ArrowLeft', 'KeyA'];
const RIGHT_KEYS = ['ArrowRight', 'KeyD'];
const JUMP_KEYS = ['Space', 'ArrowUp', 'KeyW'];
const TYPING_TAGS = ['INPUT', 'SELECT', 'TEXTAREA'];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const isTyping = (event) => TYPING_TAGS.includes(event.target?.tagName);

const directionFrom = (pressed) => {
  const right = RIGHT_KEYS.some((key) => pressed.has(key)) ? 1 : 0;
  const left = LEFT_KEYS.some((key) => pressed.has(key)) ? 1 : 0;
  return right - left;
};

const poseFor = (motion, direction) => {
  if (motion.y > 0) {
    return 'jump';
  }
  if (direction === 0) {
    return 'idle';
  }
  return Math.floor(motion.stepClock / STEP_MS) % 2 === 0 ? 'walk' : 'idle';
};

const useHeroControls = ({ sceneWidth, heroWidth }) => {
  const [hero, setHero] = useState({ x: 0, y: 0, facing: 1, pose: 'idle', ready: false });
  const pressed = useRef(new Set());
  const motion = useRef({ x: null, y: 0, vy: 0, facing: 1, stepClock: 0, jumpQueued: false });
  const bounds = useRef({ sceneWidth, heroWidth });

  useEffect(() => {
    bounds.current = { sceneWidth, heroWidth };
  }, [sceneWidth, heroWidth]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isTyping(event)) {
        return;
      }
      if (JUMP_KEYS.includes(event.code)) {
        event.preventDefault();
        motion.current.jumpQueued = true;
        return;
      }
      if (LEFT_KEYS.includes(event.code) || RIGHT_KEYS.includes(event.code)) {
        event.preventDefault();
        pressed.current.add(event.code);
      }
    };
    const handleKeyUp = (event) => pressed.current.delete(event.code);
    const handleBlur = () => pressed.current.clear();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  useEffect(() => {
    let frameId = 0;
    let lastTime = performance.now();

    const step = (now) => {
      const seconds = Math.min((now - lastTime) / 1000, MAX_FRAME_SECONDS);
      lastTime = now;
      const state = motion.current;
      const { sceneWidth: width, heroWidth: size } = bounds.current;

      if (width > 0) {
        const direction = directionFrom(pressed.current);
        const startX = state.x ?? Math.round(width * START_RATIO);
        state.x = clamp(startX + direction * SPEED * seconds, 0, Math.max(0, width - size));
        state.facing = direction === 0 ? state.facing : direction;
        state.stepClock = direction === 0 ? 0 : state.stepClock + seconds * 1000;

        if (state.jumpQueued && state.y === 0) {
          state.vy = JUMP_VELOCITY;
        }
        state.jumpQueued = false;

        if (state.y > 0 || state.vy > 0) {
          state.vy -= GRAVITY * seconds;
          state.y = Math.max(0, state.y + state.vy * seconds);
          state.vy = state.y === 0 ? 0 : state.vy;
        }

        const next = {
          x: Math.round(state.x),
          y: Math.round(state.y),
          facing: state.facing,
          pose: poseFor(state, direction),
          ready: true,
        };
        setHero((previous) => (
          previous.x === next.x
          && previous.y === next.y
          && previous.facing === next.facing
          && previous.pose === next.pose
          && previous.ready
            ? previous
            : next
        ));
      }

      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return hero;
};

export { useHeroControls };
