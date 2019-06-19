// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
      "postcss-import": {},
      "postcss-url": {},
      "postcss-aspect-ratio-mini": {},
      "postcss-write-svg": {
          utf8: false
      },
      "postcss-cssnext": {},

      "postcss-px-to-viewport": {
          viewportWidth: 375,     // (Number) The width of the viewport.
          viewportHeight: 667,    // (Number) The height of the viewport.
          unitPrecision: 3,       // (Number) The decimal numbers to allow the REM units to grow to.
          viewportUnit: 'vw',     // (String) Expected units.
          selectorBlackList: ['.ignore', '.c-px', ':before', ':after'],  // (Array) The selectors to ignore and leave as px.
          minPixelValue: 1,       // (Number) Set the minimum pixel value to replace.
          mediaQuery: false       // (Boolean) Allow px to be converted in media queries.
      },
      "postcss-viewport-units":{},

      "postcss-1px2rem": {
        remUnit: 14
      },

      "cssnano": {
          preset: "advanced",
          autoprefixer: false,	//cssnext和cssnano都具有autoprefixer
          "postcss-zindex": false
      }
  }
}
