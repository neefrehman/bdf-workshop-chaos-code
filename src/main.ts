import pallettes from "nice-color-palettes";

import { type Canvas2DSetupFn, render2DCanvasSketch } from "renderers/canvas2D";
import {
  type BezierCurvePoints,
  bezierCurveBetween,
  clearBackgroundWithColor,
  generateTextPath,
} from "utils/canvas2d";
import { getDistance, type Vector } from "utils/math";
import { getShortestViewportDimension } from "utils/math";
import { inRange, pick } from "utils/random";

/**
 * A point with it's own state, with a handful of methods for drawing and connecting
 */
class NoisePoint {
  /** the canvas rendering context, so we can easily access the web's native canvas methods */
  ctx: CanvasRenderingContext2D;
  /** the x offset, which will be used for our noise field */
  xOff: number;
  /** the y offset, which will be used for our noise field */
  yOff: number;
  /** the x position of the point */
  x: number;
  /** the y position of the point */
  y: number;
  /** the velocity of the point */
  v: number;

  /** the constructor will set the initial state of the NoisePoint */
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.xOff = 0;
    this.yOff = 0;
    this.v = 0.005;
  }

  /**
   * Will move the NoisePoint to it's position for the current frame
   * TODO: this function should be updated to move the point to a new position each frame
   *       using a noise field, to give it some natural feeling motion.
   */
  move = (): void => {
    this.xOff += this.v;
    this.yOff += this.v;
    this.x = 1;
    this.y = 1;
  };

  /** Will draw the point onto the canvas */
  drawPoint = (): void => {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    this.ctx.strokeStyle = "rgb(255, 255, 255)";
    this.ctx.stroke();
  };

  /** Will find the 15 closest points to this point, when given a list of points */
  getNearestPointsFromPath = (pointArray: Vector<2>[]): Vector<2>[] => {
    const sortedPointArray = pointArray.sort(
      (a, b) => getDistance(a, [this.x, this.y]) - getDistance(b, [this.x, this.y])
    );
    const nearestPoints = sortedPointArray.slice(0, 15);
    return nearestPoints;
  };

  /**
   * Will get the co-ordinates of a bezier curve to draw between this point and another
   * TODO: this function should be updated to use a noise field to create the second
   *       and third co-ordinates using a noise field, to give it some natural curves.
   *       Currently it will only draw a straight line.
   */
  getBezierCurveCoordinates = (nearestPoint: Vector<2>): BezierCurvePoints => {
    const [x, y] = nearestPoint;
    return [
      [this.x, this.y],
      [this.x, this.y],
      [x, y],
      [x, y],
    ];
  };

  /** will draw a bezier curve for given co-ordinates */
  drawBezierCurveTo = (nearestPoint: Vector<2>, { colour = "white" }): void => {
    this.ctx.strokeStyle = colour;
    this.ctx.lineWidth = 3;
    bezierCurveBetween(this.ctx, ...this.getBezierCurveCoordinates(nearestPoint));
  };
}

const sketch: Canvas2DSetupFn = ({ ctx, width, height }) => {
  // Here we choose a random colour palette and a random foreground and background from it
  const pallette = pick(pallettes);
  const backgroundColor = pick(pallette);
  let foregroundColor = pick(pallette);
  while (backgroundColor === foregroundColor) {
    foregroundColor = pick(pallette);
  }

  // We declare a word and use it's length to determine the scale to draw it at
  const WORD = "HI";
  const SCALE = getShortestViewportDimension({ cap: 900 }) / (WORD.length / 1.5);
  ctx.font = `${SCALE}px Helvetica`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  // This will draw the same text as we draw each frame, sample it into a path, and store
  // each point in the path to a variable that we can use later to connect to our NoisePoints
  const textPath = generateTextPath(ctx, WORD, width / 2, height / 2);

  // Here we are creating a random integer between 8 and 20 and creating as many
  // instances of our NoisePoint class for us to use later
  const POINT_COUNT = inRange(8, 20, { isInteger: true });
  const points = [...Array(POINT_COUNT)].map(() => new NoisePoint(ctx));

  // this function will be run on every frame of our sketch
  return ({}) => {
    // We clear the the previous frame of the canvas and draw the word again
    clearBackgroundWithColor(ctx, backgroundColor);
    ctx.fillStyle = foregroundColor;
    ctx.fillText(WORD, width / 2, height / 2);

    // For each of our created noise point instance we update it with it's methods
    points.forEach(point => {
      point.move();
      point.drawPoint();
      const nearestPointsOnTextPath = point.getNearestPointsFromPath(textPath);
      nearestPointsOnTextPath.forEach(nearestPointOnTextPath => {
        point.drawBezierCurveTo(nearestPointOnTextPath, { colour: pick(pallette) });
      });
    });
  };
};

// This function will render the sketch onto the screen. It's a utility that I created
// for canvas-based animations and that I use in a handful of projects. Feel free to
// peek under the hood if you're interested.
render2DCanvasSketch({
  sketch,
  settings: { animationSettings: { fps: 10 } },
});
