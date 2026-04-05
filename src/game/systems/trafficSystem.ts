import {
  LANE_COUNT,
  TRAFFIC_DESPAWN_Y,
  TRAFFIC_MAX_SPEED,
  TRAFFIC_MIN_SPEED,
  TRAFFIC_SPRITES,
} from "../constants/game";
import type { GameState, TrafficCar } from "../types";
import { clamp, distanceOverlap } from "../utils/math";
import { nextId, randomBetween, randomInt } from "../utils/random";

function canSpawnTraffic(cars: TrafficCar[], lane: number) {
  return cars.every((car) => car.lane !== lane || !distanceOverlap(car.y, car.height, -0.2, 0.36));
}

function spawnTrafficCar(cars: TrafficCar[]) {
  const laneOrder = Array.from({ length: LANE_COUNT }, (_, index) => index).sort(() => Math.random() - 0.5);
  const lane = laneOrder.find((candidate) => canSpawnTraffic(cars, candidate));

  if (lane === undefined) {
    return null;
  }

  return {
    id: nextId("traffic"),
    lane,
    y: -0.18,
    speed: randomBetween(TRAFFIC_MIN_SPEED, TRAFFIC_MAX_SPEED),
    width: 40,
    height: 78,
    spriteId: TRAFFIC_SPRITES[randomInt(0, TRAFFIC_SPRITES.length - 1)],
  } satisfies TrafficCar;
}

export function updateTrafficState(state: GameState, dt: number): GameState {
  if (state.phase !== "playing") {
    return state;
  }

  const nextCooldown = state.trafficSpawnCooldown - dt;
  const difficulty = clamp(state.distance / state.targetDistance, 0, 1);
  let nextTraffic = state.traffic
    .map((car) => ({
      ...car,
      y: car.y + (state.player.speed - car.speed) * dt * 0.014,
    }))
    .filter((car) => car.y < TRAFFIC_DESPAWN_Y);

  let cooldown = nextCooldown;
  if (cooldown <= 0) {
    const spawned = spawnTrafficCar(nextTraffic);
    if (spawned) {
      nextTraffic = [...nextTraffic, spawned];
    }
    cooldown = clamp(1.2 - difficulty * 0.55, 0.5, 1.2);
  }

  return {
    ...state,
    difficulty,
    trafficSpawnCooldown: cooldown,
    traffic: nextTraffic,
  };
}
