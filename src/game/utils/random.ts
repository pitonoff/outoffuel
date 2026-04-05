let idCounter = 0;

export function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function randomInt(min: number, max: number) {
  return Math.floor(randomBetween(min, max + 1));
}

export function nextId(prefix: string) {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}
