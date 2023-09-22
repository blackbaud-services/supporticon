module.exports = function (markup) {
  if (typeof document !== 'undefined') return;
  const { JSDOM } = require('jsdom');
  const { document } = new JSDOM(markup).window;
  global.document = document;
  global.window = document.defaultView;

  // Stub `matchMedia` to silence errors
  global.window.matchMedia =
    global.window.matchMedia ||
    function () {
      return {
        matches: false,
        addListener() {},
        removeListener() {},
      };
    };

  global.navigator = {
    userAgent: 'chrome',
  };
};
