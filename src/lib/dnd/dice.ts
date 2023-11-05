export const D2 = 2;
export const D4 = 4;
export const D6 = 6;
export const D8 = 8;
export const D10 = 10;
export const D20 = 20;

export function roll(max: number = D20) {
  return Math.ceil(Math.random() * max);
}
