/* eslint-disable */
import ZCommon from 'utils/common';
import { ZLogTemplate } from 'zlogger';
import { CoreLoggerFactory } from 'utils/logger/renderer/core/logger';
const Logger0 = new CoreLoggerFactory().createZLogger({
  id: 0,
  name: "core-mngr",
  process: "pc"
}, {
  id: 0,
  names: ['hello'],
  process: "pc"
});
const Logger3 = new CoreLoggerFactory().createZLogger({
  id: 0,
  name: "core-mngr",
  process: "pc"
}, {
  id: 1,
  names: ['feat-funny'],
  process: "pc"
});
const Logger2 = ModuleContainer.resolve(ZLoggerFactory).createZLogger({
  id: 0,
  name: "core-mngr",
  process: "pc"
}, {
  id: 2,
  names: ['feat-bording'],
  process: "pc"
});
const Logger = new CoreLoggerFactory().createZLogger({
  id: 1,
  name: "ui",
  process: "pc"
}, {
  id: 3,
  names: ['sidebar', 'conv-list'],
  process: "pc"
});
const Logger4 = new CoreLoggerFactory().createZLogger({
  id: 0,
  name: "core-mngr",
  process: "pc"
}, {
  id: 4,
  names: ['feat-funny2'],
  process: "pc"
});
const Logger5 = new CoreLoggerFactory().createZLogger({
  id: 1,
  name: "ui",
  process: "pc"
}, {
  id: 3,
  names: ['sidebar', 'conv-list2'],
  process: "pc"
});
const LoggerX = new CoreLoggerFactory().createZLogger({
  id: 1,
  name: "ui",
  process: "pc"
}, {
  id: 3,
  names: ['sidebar', 'conv-list'],
  process: "pc"
});

class TimeStart {
  constructor() {
    this._startTime = Date.now();
  }

  _showLog(content) {
    Logger.logSymbol("zlg_info", 1, {
      tags: {
        process: "pc",
        sourcemap: "test/test-2.js",
        row: 22,
        template: {
          id: 0,
          value: "tracking start {}"
        }
      }
    }, content);
    Logger.logSymbol("zlg_infoR", 2, {
      tags: {
        process: "pc",
        sourcemap: "test/test-2.js",
        row: 23,
        template: undefined
      }
    }, 'whottt', content); // Logger.zlg_info(`whottt ${templ} yeah`, content);

    Logger.logSymbol("zlg_info", 3, {
      tags: {
        process: "pc",
        sourcemap: "test/test-2.js",
        row: 25,
        template: {
          id: 1,
          value: "tracking start {} {} whot {} really"
        }
      }
    }, () => x + y, p2, p3, content);
    Logger.logSymbol("zlg_info", 4, {
      tags: {
        process: "pc",
        sourcemap: "test/test-2.js",
        row: 26,
        template: {
          id: 2,
          value: "{} tracking start {} {} whot {} really{}"
        }
      }
    }, ha, () => x + y, p2, p3, know, content);
    Logger.logSymbol("zlg_info", 5, {
      tags: {
        process: "pc",
        sourcemap: "test/test-2.js",
        row: 27,
        template: {
          id: 3,
          value: "tracking start whot really{}"
        }
      }
    }, kk, content);
    Logger.logSymbol("zlg_info", 6, {
      tags: {
        process: "pc",
        sourcemap: "test/test-2.js",
        row: 28,
        template: {
          id: 4,
          value: "tracking start{}really{}{}who knows{}"
        }
      }
    }, whot, kk, really, () => 5, content);
  }

  addLog(des, time = Date.now()) {
    this._showLog(des + ": " + (time - this._startTime));

    Logger.logSymbol("zlg_info", 7, {
      tags: {
        process: "pc",
        sourcemap: "test/test-2.js",
        row: 33,
        template: {
          id: 5,
          value: "HELLOJames {}. My name is {} Tracking start whot really{}"
        }
      }
    }, y, name, kk, content);
    Logger.logSymbol("zlg_info", 8, {
      tags: {
        process: "pc",
        sourcemap: "test/test-2.js",
        row: 34,
        template: {
          id: 6,
          value: "HELLO James . My name is Tracking start whot really"
        }
      }
    });
  }

  initStartTime() {
    this._startTime = Date.now();
  }

}

const timeStart = new TimeStart();
export default timeStart;