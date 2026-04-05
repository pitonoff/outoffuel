import type { GameState, InputState } from "../types";

export const LANE_COUNT = 3;
export const FIXED_TIMESTEP = 1 / 60;
export const UI_PUBLISH_INTERVAL_MS = 33;
export const TARGET_DISTANCE = 2400;
export const MAX_SPEED = 170;
export const MIN_SPEED = 0;
export const ECO_SPEED_MIN = 58;
export const ECO_SPEED_MAX = 88;
export const LOW_SPEED_THRESHOLD = 45;
export const HIGH_SPEED_THRESHOLD = 90;
export const INITIAL_FUEL = 26;
export const INITIAL_BATTERY = 55;
export const INITIAL_SPEED = 42;
export const PLAYER_WIDTH = 42;
export const PLAYER_HEIGHT = 84;
export const TRAFFIC_MIN_SPEED = 38;
export const TRAFFIC_MAX_SPEED = 108;
export const TRAFFIC_DESPAWN_Y = 1.25;
export const START_MESSAGE = "Swipe or use arrows to steer. Hold pedal buttons to drive.";
export const WIN_MESSAGE = "You reached the gas station.";
export const LOSE_MESSAGE_FUEL = "You ran out of fuel and charge.";
export const LOSE_MESSAGE_CRASH = "Traffic collision.";

export const TRAFFIC_COLORS = ["#D94841", "#F2C24C", "#5AA9FF", "#E3E5E8", "#7ED18A"] as const;

export const DEFAULT_INPUT_STATE: InputState = {
  acceleratePressed: false,
  brakePressed: false,
  laneChangeIntent: 0,
  acceleratePulseTime: 0,
  brakePulseTime: 0,
};

export function createInitialGameState(): GameState {
  return {
    phase: "intro",
    elapsedTime: 0,
    distance: 0,
    targetDistance: TARGET_DISTANCE,
    roadOffset: 0,
    trafficSpawnCooldown: 0.6,
    difficulty: 0,
    ecoMeter: 0,
    message: START_MESSAGE,
    player: {
      lane: 1,
      targetLane: 1,
      lateralOffset: 1,
      speed: INITIAL_SPEED,
      fuel: INITIAL_FUEL,
      battery: INITIAL_BATTERY,
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      hybridMode: "CHARGE",
      wrecked: false,
    },
    traffic: [],
  };
}
