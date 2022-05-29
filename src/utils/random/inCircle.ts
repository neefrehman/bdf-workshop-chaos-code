import type { Vector } from "../math";

import { seededRandom } from "./seededRandom";

/**
 * Chooses a random 2D point around the perimiter of a circle, optionally scaled to `radius`.
 *
 * @param radius - The radius of the circle
 * @returns A vector point around the circles' perimiter
 */
export const onCircle = (radius = 1): Vector<2> => {
  const theta = seededRandom() * 2.0 * Math.PI;
  const x = radius * Math.cos(theta);
  const y = radius * Math.sin(theta);
  return [x, y];
};

/**
 * Chooses a random 2D point within a circle, optionally scaled to `radius`.
 *
 * @param radius - The radius of the circle
 * @returns A vector point within the circle
 */
export const insideCircle = (radius = 1): Vector<2> => {
  let [x, y] = onCircle(1);
  const r = radius * Math.sqrt(seededRandom());
  x *= r;
  y *= r;
  return [x, y];
};

/**
 * Chooses a random 3D point around the perimiter of a sphere, optionally scaled to `radius`.
 *
 * @param radius - The radius of the sphere
 * @returns A vector point around the sphere's perimiter
 */
export const onSphere = (radius = 1): Vector<3> => {
  const u = seededRandom() * Math.PI * 2;
  const v = seededRandom() * 2 - 1;

  const phi = u;
  const theta = Math.acos(v);

  const x = radius * Math.sin(theta) * Math.cos(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(theta);
  return [x, y, z];
};

/**
 * Chooses a random 3D point within a sphere, optionally scaled to `radius`.
 *
 * @param radius - The radius of the sphere
 * @returns A vector point within the sphere
 */
export const insideSphere = (radius = 1): Vector<3> => {
  const u = seededRandom() * Math.PI * 2;
  const v = seededRandom() * 2 - 1;
  const k = seededRandom();

  const phi = u;
  const theta = Math.acos(v);
  const r = radius * Math.cbrt(k);

  const x = r * Math.sin(theta) * Math.cos(phi);
  const y = r * Math.sin(theta) * Math.sin(phi);
  const z = r * Math.cos(theta);
  return [x, y, z];
};
