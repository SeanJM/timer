const IS_MAC = /Macintosh/.test(window.navigator.userAgent);

export const KEYNAME_BY_CODE = {
  8: "BACKSPACE",
  13: "ENTER",
  16: "SHIFT",
  17: IS_MAC ? "META" : "CTRL",
  18: "ALT",
  27: "ESC",
  37: "LEFT",
  38: "UP",
  39: "RIGHT",
  40: "DOWN",
  46: "DELETE",
  91: IS_MAC ? "CTRL" : "META",
};