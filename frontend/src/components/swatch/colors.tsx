import blush from "blush";
const base = "#bb2248";
const colors = [];

function pushColor(transform: (i: number, c: typeof blush) => typeof blush, base: typeof blush, length: number) {
  let i = -1;
  let array = [];
  while (++i < length) {
    array.push(transform(i, blush(base)).hex());
  }
  return array;
}

Array.prototype.push.apply(colors, pushColor(
  (i, b) => b.saturate(-0.1).lighten(0.1).rotate(360/12*i), 
  blush(base), 
  12)
);

Array.prototype.push.apply(colors, pushColor(
  (i, b) => b.lighten(0.2*i), 
  blush(base).darken(0.1).rotate(-10).saturate(-0.5), 
  3)
);

Array.prototype.push.apply(colors, pushColor(
  (i, b) => b.lighten(0.2*i), 
  blush(base).darken(0.1).rotate(30).saturate(-0.5), 
  3)
);

Array.prototype.push.apply(colors, pushColor(
  (i, b) => b.lighten(0.2*i), 
  blush(base).darken(0.1).rotate(180).saturate(-0.5), 
  3)
);

Array.prototype.push.apply(colors, pushColor(
  (i, b) => b.lighten(0.2*i), 
  blush(base).darken(0.1).rotate(220).saturate(-0.5), 
  3)
);

export default colors;