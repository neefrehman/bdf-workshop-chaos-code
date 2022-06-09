import pallettes from "nice-color-palettes";

import { type Canvas2DSetupFn, render2DCanvasSketch } from "renderers/canvas2D";
import {
  type BezierCurvePoints,
  bezierCurveBetween,
  clearBackgroundWithColor,
  generateTextPath,
} from "utils/canvas2d";
import { getDistance, lerpVector, mapToRange, type Vector } from "utils/math";
import { getShortestViewportDimension } from "utils/math";
import { inRange, pick, simplex1D, inGaussian } from "utils/random";

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
    this.xOff += this.v;
    this.yOff += this.v;
    this.x = mapToRange(simplex1D(this.xOff), -1, 1, 0, this.ctx.canvas.width / 2);
    this.y = mapToRange(simplex1D(this.yOff), -1, 1, 0, this.ctx.canvas.height / 2);
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

  getBezierCurvePoints = (nearestPoint: Vector<2>): BezierCurvePoints => {
    const [x, y] = nearestPoint;
    const nX = x + inRange(2);
    const nY = y + inRange(2);
    const vectorNearPoint: Vector<2> = [
      this.x + simplex1D(this.x) * 5,
      this.y + simplex1D(this.y) * 5,
    ];
    const vectorNearPath: Vector<2> = [
      nX + simplex1D(nX) * 50,
      nY + simplex1D(nY) * 50,
    ];
    const cp1 = lerpVector(vectorNearPoint, vectorNearPath, inGaussian(0.33, 0.1));
    const cp2 = lerpVector(vectorNearPoint, vectorNearPath, inGaussian(0.66, 0.1));
    return [[this.x, this.y], cp1, cp2, [nX, nY]];
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
  const POINT_COUNT = inRange(8, 20, { isInteger: true });
  const points: NoisePoint[] = [...Array(POINT_COUNT)].map(() => new NoisePoint(ctx));

  return ({}) => {
    clearBackgroundWithColor(ctx, backgroundColor);
    ctx.fillStyle = foregroundColor;
    ctx.fillText(WORD, width / 2, height / 2);

    points.forEach(point => {
      point.move();
      point.drawPoint();
      const nearestPointsOnTextPath = point.getNearestPointsFromPath(textPath);
      nearestPointsOnTextPath.forEach(nearestPointOnTextPath => {
        point.drawBezierCurve(nearestPointOnTextPath, pick(pallette));
      });
    });
  };
};

render2DCanvasSketch({
  sketch,
  settings: { animationSettings: { fps: 10 } },
});
