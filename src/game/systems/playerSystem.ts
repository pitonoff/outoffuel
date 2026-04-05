import {
  LANE_COUNT,
  MAX_SPEED,
  MIN_SPEED,
} from "../constants/game";
import type { GameState, InputState } from "../types";
import { clamp, lerp } from "../utils/math";

const ACCELERATION_RATE = 42;
const BRAKE_RATE = 70;
const COAST_DRAG = 12;
const LANE_BLEND_SPEED = 10;

export function updatePlayerState(state: GameState, input: InputState, dt: number): GameState {
  if (state.phase !== "playing") {
    return state;
  }

  const accelerateActive = input.acceleratePressed || input.acceleratePulseTime > 0;
  const brakeActive = input.brakePressed || input.brakePulseTime > 0;
  const nextPlayer = { ...state.player };

  if (input.laneChangeIntent !== 0) {
    nextPlayer.targetLane = clamp(nextPlayer.targetLane + input.laneChangeIntent, 0, LANE_COUNT - 1);
  }

  if (accelerateActive) {
    nextPlayer.speed += ACCELERATION_RATE * dt;
  } else if (brakeActive) {
    nextPlayer.speed -= BRAKE_RATE * dt;
  } else {
    nextPlayer.speed -= COAST_DRAG * dt;
  }

  nextPlayer.speed = clamp(nextPlayer.speed, MIN_SPEED, MAX_SPEED);
  nextPlayer.lane = nextPlayer.targetLane;
  nextPlayer.lateralOffset = lerp(nextPlayer.lateralOffset, nextPlayer.targetLane, Math.min(1, dt * LANE_BLEND_SPEED));

  return {
    ...state,
    player: nextPlayer,
  };
}
