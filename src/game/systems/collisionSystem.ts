import { LOSE_MESSAGE_CRASH } from "../constants/game";
import type { GameState } from "../types";

const PLAYER_Y = 0.82;

export function updateCollisionState(state: GameState): GameState {
  if (state.phase !== "playing") {
    return state;
  }

  const hit = state.traffic.some((car) => {
    const sameLane = car.lane === state.player.targetLane;
    const verticalOverlap = Math.abs(car.y - PLAYER_Y) < 0.12;
    return sameLane && verticalOverlap;
  });

  if (!hit) {
    return state;
  }

  return {
    ...state,
    phase: "lose",
    message: LOSE_MESSAGE_CRASH,
    player: {
      ...state.player,
      wrecked: true,
    },
  };
}
