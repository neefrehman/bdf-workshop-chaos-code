import { fixDevicePixelRatio } from "utils/canvas2d";

import { useAnimationFrame } from "./useAnimationFrame";
import type {
  RendererProps,
  RendererSettings,
  DrawProps,
  SetupFn,
  DrawFn,
  SetupProps,
} from "./types";

/**
 * A wrapper component for running vanilla 2D canvas sketches. Handles rendering and cleanup.
 */
export const render2DCanvasSketch = ({
  sketch: setupSketch,
  settings = {},
}: Canvas2DRendererProps) => {
  let drawProps: Canvas2DDrawProps = {} as Canvas2DDrawProps;
  let drawFunction: Canvas2DDrawFn | null = null;

  const {
    dimensions = [window.innerWidth, window.innerHeight],
    isAnimated = true,
    animationSettings = {},
  } = settings;

  const [width, height] = dimensions;
  const { fps: throttledFps, delay, endAfter } = animationSettings;

  const canvasElement = document.createElement("canvas");
  canvasElement.width = width;
  canvasElement.height = height;
  document.body.appendChild(canvasElement);

  const { startAnimation, stopAnimation } = useAnimationFrame(
    animationProps =>
      drawFunction?.({
        ...drawProps,
        ...animationProps,
        startAnimation,
        stopAnimation,
      }),
    {
      willPlay: isAnimated,
      fps: throttledFps,
      delay,
      endAfter,
      domElement: canvasElement,
    }
  );

  const canvasEl = canvasElement;
  const ctx = canvasEl.getContext("2d");
  if (!ctx) throw new Error("could not create canvas context");
  fixDevicePixelRatio(canvasEl, ctx);

  const initialSketchProps: Canvas2DDrawProps = {
    ctx,
    canvas: canvasEl,
    width,
    height,
    aspect: width / height,
    mouseHasEntered: false,
    mousePosition: [0, 0],
  };

  const drawSketch = setupSketch(initialSketchProps);

  drawProps = initialSketchProps;
  drawFunction = drawSketch;
};

// <- TYPES ->

export type Canvas2DRendererProps = RendererProps<Canvas2DSetupFn>;

/**
 * Settings for the Canvas 2D sketch
 */
export type { RendererSettings as Canvas2DRendererSettings };

/**
 * Props to be recieved by the Canvas 2D sketch.
 */
export type Canvas2DSetupProps = {
  /** the rendering context to call canvas methods on - in this case 2d */
  ctx: CanvasRenderingContext2D;
  /** The DOM canvas element that is rendering the sketch */
  canvas: HTMLCanvasElement;
} & SetupProps;

/**
 * Props to be recieved by the Canvas 2D sketch.
 */
export type Canvas2DDrawProps = Canvas2DSetupProps & DrawProps;

/**
 * The setup function to be passed into the React component, with access to `Canvas2DDrawProps`.
 *
 * The contents of this function should contain all sketch state, with the drawing happening
 * inside it's returned draw function.
 */
export type Canvas2DSetupFn = SetupFn<Canvas2DSetupProps, Canvas2DDrawFn>;

/**
 * The draw function returned by `Canvas2DSetupFn`, with access to `Canvas2DSketchProps`.
 *
 * If the sketch is animated, this function will be called every frame.
 */
export type Canvas2DDrawFn = DrawFn<Canvas2DDrawProps>;
