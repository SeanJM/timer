const path = require("path");

module.exports = function (__root) {
  return {
    extensions: [".js", ".jsx"],
    alias: {
      "@frontend/action/": path.join(__root, "frontend/src/action"),
      "@class": path.join(__root, "frontend/src/class"),
      "@constants": path.join(__root, "frontend/src/constants"),
      "@components": path.join(__root, "frontend/src/components"),
      "@images": path.join(__root, "frontend/src/images"),
      "@localization": path.join(__root, "frontend/src/localization"),
      "@pages": path.join(__root, "frontend/src/pages"),
      "@scripts": path.join(__root, "frontend/src/scripts"),
      "@store": path.join(__root, "frontend/src/store"),
    },
  };
};