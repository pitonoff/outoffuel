import { useCallback, useEffect, useRef, useState } from "react";

import {
  FIXED_TIMESTEP,
  UI_PUBLISH_INTERVAL_MS,
  createInitialGameState,
} from "../constants/game";
import type { GameState, InputState } from "../types";
import { stepGameState } from "../utils/gameStep";

interface UseGameLoopOptions {
  consumeInputFrame: (dt: number) => InputState;
}

export function useGameLoop({ consumeInputFrame }: UseGameLoopOptions) {
  const stateRef = useRef<GameState>(createInitialGameState());
  const [snapshot, setSnapshot] = useState<GameState>(stateRef.current);
  const rafRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const accumulatorRef = useRef(0);
  const lastPublishRef = useRef(0);

  const startGame = useCallback(() => {
    previousTimeRef.current = null;
    accumulatorRef.current = 0;
    stateRef.current = {
      ...createInitialGameState(),
      phase: "playing",
      message: "",
    };
    setSnapshot(stateRef.current);
  }, []);

  useEffect(() => {
    const frame = (timestamp: number) => {
      const previous = previousTimeRef.current ?? timestamp;
      const deltaSeconds = Math.min((timestamp - previous) / 1000, 0.1);
      previousTimeRef.current = timestamp;
      accumulatorRef.current += deltaSeconds;

      while (accumulatorRef.current >= FIXED_TIMESTEP) {
        const input = consumeInputFrame(FIXED_TIMESTEP);
        stateRef.current = stepGameState(stateRef.current, input, FIXED_TIMESTEP);
        accumulatorRef.current -= FIXED_TIMESTEP;
      }

      const shouldPublish =
        timestamp - lastPublishRef.current >= UI_PUBLISH_INTERVAL_MS ||
        snapshot.phase !== stateRef.current.phase;

      if (shouldPublish) {
        lastPublishRef.current = timestamp;
        setSnapshot({ ...stateRef.current, player: { ...stateRef.current.player }, traffic: [...stateRef.current.traffic] });
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [consumeInputFrame, snapshot.phase]);

  return {
    gameState: snapshot,
    gameStateRef: stateRef,
    startGame,
  };
}
