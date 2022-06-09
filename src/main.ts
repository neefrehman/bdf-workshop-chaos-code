import pallettes from "nice-color-palettes";

import { type Canvas2DSetupFn, render2DCanvasSketch } from "renderers/canvas2D";
import type { BezierCurvePoints } from "utils/canvas2d";
import {
  bezierCurveBetween,
  clearBackgroundWithColor,
  generateTextPath,
} from "utils/canvas2d";
import { getDistance, type Vector } from "utils/math";
import { getShortestViewportDimension } from "utils/math";
import { inRange, pick, inGaussian } from "utils/random";

class NoisePoint {
  ctx: CanvasRenderingContext2D;
  xOff: number;
  yOff: number;
  x: number;
  y: number;
  v: number;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.xOff = inRange(200);
    this.yOff = inRange(400, 600);
    this.v = inGaussian(0.005, 0.001);
  }

  move = (): void => {
    // We'll be completing this in the workshop
    this.xOff += this.v;
    this.yOff += this.v;
  };

  drawPoint = (): void => {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    this.ctx.strokeStyle = "rgb(255, 255, 255)";
    this.ctx.stroke();
  };

  getNearestPointsFromPath = (pointArray: Vector<2>[]): Vector<2>[] => {
    const sortedPointArray = pointArray.sort(
      (a, b) => getDistance(a, [this.x, this.y]) - getDistance(b, [this.x, this.y])
    );
    const nearestPoints = sortedPointArray.slice(0, 15);
    return nearestPoints;
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore, we'll complete this function in the workshop
  getBezierCurvePoints = (nearestPoint: Vector<2>): BezierCurvePoints => {
    const [x, y] = nearestPoint;
  };

  drawBezierCurve = (nearestPoint: Vector<2>, colour = "white"): void => {
    this.ctx.strokeStyle = colour;
    this.ctx.lineWidth = 3;
    bezierCurveBetween(this.ctx, ...this.getBezierCurvePoints(nearestPoint));
  };
}

const sketch: Canvas2DSetupFn = ({ ctx, width, height }) => {
  const pallette = pick(pallettes);
  const backgroundColor = pick(pallette);
  let foregroundColor = pick(pallette);
  while (backgroundColor === foregroundColor) {
    foregroundColor = pick(pallette);
  }

  const WORD = "HI";
  const SCALE = getShortestViewportDimension({ cap: 900 }) / (WORD.length / 1.5);
  ctx.font = `${SCALE}px Helvetica`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  const textPath = generateTextPath(ctx, WORD, width / 2, height / 2);

  return ({}) => {
    clearBackgroundWithColor(ctx, backgroundColor);
    ctx.fillStyle = foregroundColor;
    ctx.fillText(WORD, width / 2, height / 2);
  };
};

render2DCanvasSketch({
  sketch,
  settings: { animationSettings: { fps: 10 } },
});
