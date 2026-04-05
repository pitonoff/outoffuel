import type { GameState, InputState } from "../types";
import { updateCollisionState } from "../systems/collisionSystem";
import { updateHybridState } from "../systems/hybridSystem";
import { updatePlayerState } from "../systems/playerSystem";
import { updateProgressionState } from "../systems/progressionSystem";
import { updateTrafficState } from "../systems/trafficSystem";

export function stepGameState(previous: GameState, input: InputState, dt: number) {
  let next = updatePlayerState(previous, input, dt);
  next = updateHybridState(next, input, dt);
  next = updateTrafficState(next, dt);
  next = updateCollisionState(next);
  next = updateProgressionState(next, dt);
  return next;
}
