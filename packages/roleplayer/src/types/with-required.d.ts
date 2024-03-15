/**
 * Required
 * @desc From `T` make a set of properties by key `K` become required
 * @example
 *    type Props = {
 *      name?: string;
 *      age?: number;
 *      visible?: boolean;
 *    };
 *
 *    // Expect: { name: string; age: number; visible: boolean; }
 *    type Props = Required<Props>;
 *
 *    // Expect: { name?: string; age: number; visible: boolean; }
 *    type Props = Required<Props, 'age' | 'visible'>;
 */
export type AugmentedRequired<T extends object, K extends keyof T = keyof T> = Omit<T, K> & Required<Pick<T, K>>;
