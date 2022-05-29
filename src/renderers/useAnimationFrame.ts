import { getMean } from "utils/math";
import type { Vector } from "utils/math";

/**
 * A wrapper around `requestAnimationFrame` with some fancy utils
 *
 * @param onFrame - A callback to be run on every frame of the animation
 * @param options - An optional configuration object for the animation
 * @returns An object containing the animations `OnFrameProps`, as well as a functions to stop and start the animation
 */
export const useAnimationFrame = (
  onFrame?: (props: OnFrameProps) => void,
  options: UseAnimationFrameOptions = {}
): UseAnimationFrameResult => {
  const {
    onStart,
    onEnd,
    delay,
    endAfter,
    fps: throttledFps,
    mouseIdleTimeout = 3500,
    willPlay = true,
    domElement,
  } = options;

  let requestRef = 0;
  const startTimeRef = performance.now();
  let prevFrameTimeRef = performance.now();

  let isPlaying = false;
  let elapsedTime = 0;
  let deltaTime = 0;
  let frameCount = 1;
  let fpsArray: number[] = new Array(20).fill(throttledFps ?? 60);
  let averageFps = throttledFps ?? 60;

  let mousePosition: Vector<2> = [0, 0];
  let normalisedMousePosition: Vector<2> = [0, 0];
  let mouseHasEntered = false;
  let mouseIsIdle = true;
  let mouseIsDown = false;

  const animate = (timestamp: DOMHighResTimeStamp) => {
    elapsedTime = Math.round(timestamp - startTimeRef);
    deltaTime = timestamp - prevFrameTimeRef;
    const currentFps = Math.round(1 / deltaTime);

    const runFrame = () => {
      onFrame?.({
        elapsedTime,
        deltaTime,
        frameCount,
        fps: averageFps,
        isPlaying,
        mouseHasEntered,
        mousePosition,
        normalisedMousePosition,
        mouseIsDown,
        mouseIsIdle,
      });

      frameCount += 1;
      fpsArray.shift();
      fpsArray = [...fpsArray, currentFps];
      averageFps = getMean(fpsArray);
      prevFrameTimeRef = timestamp;
    };

    if (throttledFps) {
      if (deltaTime >= 1000 / throttledFps) runFrame();
    } else {
      runFrame();
    }

    requestRef = requestAnimationFrame(animate);
  };

  const startAnimation = () => {
    if (!isPlaying) {
      requestRef = requestAnimationFrame(animate);
      isPlaying = true;
    }
  };

  const stopAnimation = () => {
    if (isPlaying) {
      cancelAnimationFrame(requestRef);
      isPlaying = false;
    }
  };

  if (willPlay) {
    setTimeout(() => {
      startAnimation();
      onStart?.();
    }, delay ?? 0);

    if (endAfter) {
      setTimeout(() => {
        stopAnimation();
        onEnd?.();
      }, endAfter);
    }
  }

  // mouse events
  let idleTimeout: ReturnType<typeof setTimeout>;
  const handleIdleChange = () => {
    mouseIsIdle = false;
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => {
      mouseIsIdle = true;
    }, mouseIdleTimeout);
  };

  const updateMousePosition = (x: number, y: number): void => {
    if (domElement) {
      const canvasBounds = domElement.getBoundingClientRect();
      const posX = x - canvasBounds.left;
      const posY = y - canvasBounds.top;

      mousePosition = [posX, posY];
      normalisedMousePosition = [
        posX / canvasBounds.width,
        posY / canvasBounds.height,
      ];

      mouseHasEntered = true;
      handleIdleChange();
    }
  };

  const handleMouseDown = (e: MouseEvent): void => {
    updateMousePosition(e.clientX, e.clientY);
    mouseIsDown = true;
  };

  const handleMouseMove = (e: MouseEvent): void => {
    updateMousePosition(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: TouchEvent): void => {
    const touch = e.touches[0];
    updateMousePosition(touch.clientX, touch.clientY);
    mouseIsDown = true;
  };

  const handleTouchMove = (e: TouchEvent): void => {
    const touch = e.touches[0];
    updateMousePosition(touch.clientX, touch.clientY);
  };

  const handleMouseAndTouchUp = (): void => {
    mouseIsDown = false;
  };

  if (domElement) {
    domElement.addEventListener("mousedown", handleMouseDown);
    domElement.addEventListener("mousemove", handleMouseMove);
    domElement.addEventListener("mouseup", handleMouseAndTouchUp);
    domElement.addEventListener("touchstart", handleTouchStart);
    domElement.addEventListener("touchmove", handleTouchMove);
    domElement.addEventListener("touchend", handleMouseAndTouchUp);
  }

  return {
    elapsedTime,
    frameCount,
    fps: averageFps,
    stopAnimation,
    startAnimation,
    isPlaying,
    mouseHasEntered,
    mousePosition,
    normalisedMousePosition,
    mouseIsDown,
    mouseIsIdle,
  };
};

/**
 * An optional configuration object for `useAnimationFrame`
 */
interface UseAnimationFrameOptions {
  /** A callback that will be run once when the animation starts */
  onStart?: () => void;
  /** A callback that will be run on once when the animation ends */
  onEnd?: () => void;
  /** A delay (in ms) after which the animation will start */
  delay?: number;
  /** A time (in ms) after which the animation will be stopped */
  endAfter?: number;
  /** The desired fps that the animation will be throttled to */
  fps?: number;
  /** The timeout in ms after which the mouse is set to idle */
  mouseIdleTimeout?: number;
  /** Determines if the animation will run or not. Used to invoke the hook without starting an animation. Defaults to true */
  willPlay?: boolean;
  /** A ref to be passed of the dom element that is being animated. Used to get the mouse position over the element */
  domElement?: HTMLElement;
}

/**
 * Props for the callback that will be run on every frame of the animation
 */
export interface OnFrameProps {
  /** The current number of elapsed frames */
  frameCount?: number;
  /** The current elapsed time of the animation in ms */
  elapsedTime?: number;
  /** The difference between the current and previous frames in ms */
  deltaTime?: number;
  /** The current fps of the animation (averaged over the last 20 frames) */
  fps?: number;
  /** A function that will stop the animation when called */
  stopAnimation?: () => void;
  /** A function that will restart the animation when called */
  startAnimation?: () => void;
  /** True if the animation is currently running, otherwise false */
  isPlaying?: boolean;
  /** A boolean that is true if the mouse has interacted with the animation */
  mouseHasEntered?: boolean;
  /** The position of the mouse over the DOM element housing the animation */
  mousePosition?: Vector<2>;
  /** The position of the mouse over the DOM element, normalised between 0 and 1 */
  normalisedMousePosition?: Vector<2>;
  /** Whether the mouse is currently pressed */
  mouseIsDown?: boolean;
  /** Whether the mouse has been idle for three seconds */
  mouseIsIdle?: boolean;
}

/**
 * The returned object from `useAnimationFrame`
 */
interface UseAnimationFrameResult {
  /** the current elapsed time of the animation in ms */
  elapsedTime: number;
  /** the current number of elapsed frames */
  frameCount: number;
  /** the current fps of the animation (averaged over the last 10 frames) */
  fps: number;
  /** A function that will stop the animation when called */
  stopAnimation: () => void;
  /** A function that will restart the animation when called */
  startAnimation: () => void;
  /** a boolean that is true if the animation is currently running, otherwise false */
  isPlaying: boolean;
  /** a boolean that is true if the mouse has interacted with the animation */
  mouseHasEntered: boolean;
  /** the position of the mouse over the DOM element housing the animation */
  mousePosition: Vector<2>;
  /** The position of the mouse normalised between 0 and 1 */
  normalisedMousePosition: Vector<2>;
  /** whether the mouse is currently pressed */
  mouseIsDown: boolean;
  /** whether the mouse has been idle for three seconds */
  mouseIsIdle: boolean;
}
