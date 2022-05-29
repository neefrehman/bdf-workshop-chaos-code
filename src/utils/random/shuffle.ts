import { seededRandom } from "./seededRandom";

/**
 * Shuffles an array using fisher-yates algorithm
 *
 * @param array - the array to be shuffled
 */
export const shuffle = <T>(array: T[]) => {
  const a = [...array];

  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
