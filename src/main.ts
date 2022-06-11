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
import { inGaussian, inRange, pick, simplex1D } from "utils/random";

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

    // we give each point a random x and y starting offset, so that we
    // get different values from the noise field for them
    this.xOff = inRange(1000);
    this.yOff = inRange(1000);
    this.v = inGaussian(0.005, 0.001); // we can give each point a different velocity for some added unique-ness
  }

  /** Will move the NoisePoint to it's position for the current frame */
  move = (): void => {
    this.xOff += this.v;
    this.yOff += this.v;

    // Lets get a value from a noise field for each point's x and y offsets
    const noiseX = simplex1D(this.xOff);
    const noiseY = simplex1D(this.yOff);

    // A noise field will produce a number between -1 and 1, so we need to map the
    // output to the size of the canvas, so we can see the motion
    this.x = mapToRange(noiseX, -1, 1, 0, this.ctx.canvas.width / 2);
    this.y = mapToRange(noiseY, -1, 1, 0, this.ctx.canvas.height / 2);
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

  /** Will get the co-ordinates of a bezier curve to draw between this point and another */
  getBezierCurveCoordinates = (nearestPoint: Vector<2>): BezierCurvePoints => {
    const [x, y] = nearestPoint;

    // we give a slight random offset to the x and y co-ordinate
    // to add a bit of character to the curve
    const nX = x + inRange(2);
    const nY = y + inRange(2);

    // For a vector closer to this point, we offset each axis
    // with a value from a noise field that's been multiplied by 5
    const vectorNearPoint: Vector<2> = [
      this.x + simplex1D(this.x) * 5,
      this.y + simplex1D(this.y) * 5,
    ];

    // For a vector closer to the target point, we offset each axis
    // with a value from a noise field that's been multiplied by 50
    // This gives a bigger variance and strong curve when we're closer to the text
    const vectorNearPath: Vector<2> = [
      nX + simplex1D(nX) * 50,
      nY + simplex1D(nY) * 50,
    ];

    // To smooth the curve a bit, we will perform a lerp (linear interpolation)
    // between the vectors, with a stronger factor as we move closer to the text,
    // and some added randomness thrown in for good measure!
    const interpolationFactor1 = inGaussian(0.33, 0.1);
    const interpolationFactor2 = inGaussian(0.66, 0.1);
    const cp1 = lerpVector(vectorNearPoint, vectorNearPath, interpolationFactor1);
    const cp2 = lerpVector(vectorNearPoint, vectorNearPath, interpolationFactor2);

    // Finally we return the curve's 4 co-ordinates, which will be used to draw a bezier curve
    return [[this.x, this.y], cp1, cp2, [nX, nY]];
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
