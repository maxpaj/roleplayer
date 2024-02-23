export const D2: Dice = 2;
export const D4: Dice = 4;
export const D6: Dice = 6;
export const D8: Dice = 8;
export const D10: Dice = 10;
export const D20: Dice = 20;

export type Dice = number;

export function roll(dice: Dice) {
  return Math.ceil(Math.random() * dice);
}
