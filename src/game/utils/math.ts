export function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

export function lerp(current: number, target: number, amount: number) {
  return current + (target - current) * amount;
}

export function normalize(value: number, min: number, max: number) {
  if (max <= min) {
    return 0;
  }

  return clamp((value - min) / (max - min), 0, 1);
}

export function distanceOverlap(aCenter: number, aSize: number, bCenter: number, bSize: number) {
  return Math.abs(aCenter - bCenter) * 2 < aSize + bSize;
}
