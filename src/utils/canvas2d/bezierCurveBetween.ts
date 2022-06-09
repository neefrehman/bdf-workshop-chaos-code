import type { Vector } from "utils/math";

export type BezierCurvePoints = [Vector<2>, Vector<2>, Vector<2>, Vector<2>];

/**
 * Draws a bezier curve between 2 points
 *
 * @param ctx - the canvas context
 * @param a - the point the line will be drawn from
 * @param cp1 - curve point 1
 * @param cp2 - curve point 2
 * @param b - the point the line will be drawn two
 */
export const bezierCurveBetween = (
  ctx: CanvasRenderingContext2D,
  a: Vector<2>,
  cp1: Vector<2>,
  cp2: Vector<2>,
  b: Vector<2>
) => {
  const [ax, ay] = a as [number, number];
  const [bx, by] = b as [number, number];
  const [cp1x, cp1y] = cp1 as [number, number];
  const [cp2x, cp2y] = cp2 as [number, number];

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(ax, ay);
  ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, bx, by);
  ctx.stroke();
  ctx.closePath();
  ctx.restore();
};
