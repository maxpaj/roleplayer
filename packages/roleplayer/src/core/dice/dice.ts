export const D2: Dice = 2;
export const D4: Dice = 4;
export const D6: Dice = 6;
export const D8: Dice = 8;
export const D10: Dice = 10;
export const D20: Dice = 20;

export type Dice = number;

type DiceRollStatic = `+${number}` | "";
type DiceSize = `D${number}`;
type NumberOfDice = `${number | ""}`;

/**
 * We recommend using RPG Dice Roller for dice rolling, since it has a rich API and is well maintained.
 */
export type DiceRoll = `${NumberOfDice}${DiceSize}${DiceRollStatic}`;

export type Roll = (dice: DiceRoll) => number;

export const defaultRoll: Roll = (dice: DiceRoll) => {
  return 0;
};
