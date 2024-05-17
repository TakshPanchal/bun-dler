// This code is generated by a toy bun-dler
(function (modules, startPath) {
    function require(path) {
  
      const [fn, depMap] = modules[path];
      const module = { exports: {}};
      function localRequire(slug) {
        if (slug == startPath) {
          return {};
        }
        return require(depMap[slug]);
      }
      fn(localRequire, module, module.exports);
      return module.exports;
    }
    require(startPath);
  })({"/Users/panchalkiritbhai/dev/proj/projects/bun-dler/project/main.js": [function(require,module,exports){"use strict";

var computer = require("./computer");
console.log(computer);
module.exports = "main";}, {"./computer":"/Users/panchalkiritbhai/dev/proj/projects/bun-dler/project/computer.js"}],"/Users/panchalkiritbhai/dev/proj/projects/bun-dler/project/computer.js": [function(require,module,exports){"use strict";

module.exports = "cpu" + " " + require("./input") + " " + require("./output");}, {"./input":"/Users/panchalkiritbhai/dev/proj/projects/bun-dler/project/input.js","./output":"/Users/panchalkiritbhai/dev/proj/projects/bun-dler/project/output.js"}],"/Users/panchalkiritbhai/dev/proj/projects/bun-dler/project/input.js": [function(require,module,exports){"use strict";

module.exports = "mouse" + " " + "keyboard";}, {}],"/Users/panchalkiritbhai/dev/proj/projects/bun-dler/project/output.js": [function(require,module,exports){"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var monitor = "monitor";
var _default = exports["default"] = monitor;}, {}],}, "/Users/panchalkiritbhai/dev/proj/projects/bun-dler/project/main.js");