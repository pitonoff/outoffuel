import { LOSE_MESSAGE_FUEL, WIN_MESSAGE } from "../constants/game";
import type { GameState } from "../types";

export function updateProgressionState(state: GameState, dt: number): GameState {
  if (state.phase !== "playing") {
    return state;
  }

  const distance = state.distance + state.player.speed * dt * 0.42;
  const roadOffset = state.roadOffset + state.player.speed * dt * 0.08;
  const elapsedTime = state.elapsedTime + dt;

  if (state.player.fuel <= 0 && state.player.battery <= 0) {
    return {
      ...state,
      elapsedTime,
      distance,
      roadOffset,
      phase: "lose",
      message: LOSE_MESSAGE_FUEL,
    };
  }

  if (distance >= state.targetDistance) {
    return {
      ...state,
      elapsedTime,
      distance: state.targetDistance,
      roadOffset,
      phase: "win",
      message: WIN_MESSAGE,
    };
  }

  return {
    ...state,
    elapsedTime,
    distance,
    roadOffset,
  };
}
