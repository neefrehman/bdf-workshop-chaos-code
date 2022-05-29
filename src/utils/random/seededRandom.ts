/* eslint-disable no-console */
import seedrandom from "seedrandom";

import { toHexadecimal } from "utils/math";

const SEED_STRING_LENGTH = 12;
const createSeed = () => {
  const intArray = new Uint8Array(SEED_STRING_LENGTH);
  crypto.getRandomValues(intArray);
  return Array.from(intArray, toHexadecimal).join("");
};

const url = new URL(window.location.href);
const urlParams = url.searchParams;

export let seed = urlParams.get("seed") ?? createSeed();
export let seededRandom = seedrandom(seed);

console.log(`seed: ${seed}`);
console.log(`use it to recreate this exact sketch at {thisUrl}/?seed={seed}`);

const removeSeedFromParams = () => {
  urlParams.delete("seed");
  history.replaceState(null, document.title, url.toString());
};

export const updateSeed = () => {
  removeSeedFromParams();
  seed = createSeed();
  seededRandom = seedrandom(seed);
};
