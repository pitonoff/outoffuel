export type HybridMode = "CHARGE" | "ECO" | "POWER";

export type GamePhase = "intro" | "playing" | "win" | "lose";

export type LaneChange = -1 | 0 | 1;

export type CarSpriteId = "player" | "trafficBlue" | "trafficWhite" | "trafficBlack";

export interface InputState {
  acceleratePressed: boolean;
  brakePressed: boolean;
  laneChangeIntent: LaneChange;
  acceleratePulseTime: number;
  brakePulseTime: number;
}

export interface PlayerCar {
  lane: number;
  targetLane: number;
  lateralOffset: number;
  speed: number;
  fuel: number;
  battery: number;
  width: number;
  height: number;
  hybridMode: HybridMode;
  wrecked: boolean;
}

export interface TrafficCar {
  id: string;
  lane: number;
  y: number;
  speed: number;
  width: number;
  height: number;
  spriteId: CarSpriteId;
}

export interface GameState {
  phase: GamePhase;
  elapsedTime: number;
  distance: number;
  targetDistance: number;
  roadOffset: number;
  trafficSpawnCooldown: number;
  difficulty: number;
  ecoMeter: number;
  regenActive: boolean;
  message: string;
  player: PlayerCar;
  traffic: TrafficCar[];
}
