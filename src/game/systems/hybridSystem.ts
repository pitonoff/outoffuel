import {
  ECO_SPEED_MAX,
  ECO_SPEED_MIN,
  HIGH_SPEED_THRESHOLD,
  LOW_SPEED_THRESHOLD,
} from "../constants/game";
import type { GameState, HybridMode, InputState } from "../types";
import { clamp, normalize } from "../utils/math";

export function detectHybridMode(speed: number, accelerating: boolean, braking: boolean): HybridMode {
  if (braking || speed < LOW_SPEED_THRESHOLD) {
    return "CHARGE";
  }

  if (!accelerating && speed >= ECO_SPEED_MIN && speed <= ECO_SPEED_MAX) {
    return "ECO";
  }

  return "POWER";
}

export function updateHybridState(state: GameState, input: InputState, dt: number): GameState {
  if (state.phase !== "playing") {
    return state;
  }

  const accelerating = input.acceleratePressed || input.acceleratePulseTime > 0;
  const braking = input.brakePressed || input.brakePulseTime > 0;
  const mode = detectHybridMode(state.player.speed, accelerating, braking);

  let fuelDrain = 0;
  let batteryDrain = 0;
  let batteryRegen = 0;

  if (braking && state.player.speed > 6) {
    batteryRegen = 18 + state.player.speed * 0.08;
    batteryDrain = 0.25;
    fuelDrain = 0.2;
  } else if (mode === "CHARGE") {
    batteryDrain = 2.1 + state.player.speed * 0.012;
  } else if (mode === "ECO") {
    fuelDrain = 0.9;
    batteryDrain = 0.3;
  } else {
    fuelDrain = 3.8 + state.player.speed * 0.03;
    batteryDrain = state.player.speed > HIGH_SPEED_THRESHOLD || accelerating ? 0.8 : 0.3;
  }

  if (state.player.battery <= 0) {
    batteryDrain = 0;
    fuelDrain += 2.2;
  }

  if (state.player.fuel <= 0) {
    fuelDrain = 0;
    batteryDrain += 1.4;
  }

  const nextBattery = clamp(state.player.battery - batteryDrain * dt + batteryRegen * dt, 0, 100);
  const nextFuel = clamp(state.player.fuel - fuelDrain * dt, 0, 100);
  const ecoMeter = mode === "ECO" ? 1 : 1 - normalize(state.player.speed, ECO_SPEED_MIN, ECO_SPEED_MAX);
  const regenActive = batteryRegen > batteryDrain;

  return {
    ...state,
    ecoMeter,
    regenActive,
    player: {
      ...state.player,
      battery: nextBattery,
      fuel: nextFuel,
      hybridMode: mode,
    },
  };
}
