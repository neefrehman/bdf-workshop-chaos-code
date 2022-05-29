import pallettes from "nice-color-palettes";

import { type Canvas2DSetupFn, render2DCanvasSketch } from "renderers/canvas2D";
import { clearBackgroundWithColor } from "utils/canvas2d";
import { getShortestViewportDimension } from "utils/math";
import { pick } from "utils/random";

export const sketch: Canvas2DSetupFn = ({ ctx, width, height }) => {
  const WORD = "HI :—)";
  const SCALE = getShortestViewportDimension({ cap: 900 }) / (WORD.length / 1.3);

  ctx.font = `${SCALE}px Helvetica`;
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";

  const pallette = pick(pallettes);
  const backgroundColor = pick(pallette);
  let foregroundColor = pick(pallette);
  while (backgroundColor === foregroundColor) {
    foregroundColor = pick(pallette);
  }

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
