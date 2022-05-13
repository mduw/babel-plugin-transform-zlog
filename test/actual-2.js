import ztempls from "log-buckets/ztempls";
import zsymbs from "log-buckets/zsymbs";
import zLogFn from "log-buckets/zLogFn";
import zfid from "log-buckets/zfid";
import zmid from "log-buckets/zmid";

/* eslint-disable */
import ZCommon from 'utils/common';
import { ZLogTemplate } from 'zlogger';
import { CoreLoggerFactory } from 'utils/logger/renderer/core/logger';
const Logger0 = new CoreLoggerFactory().createZLogger(zmid[0], [zfid[0]]);
const Logger3 = new CoreLoggerFactory().createZLogger(zmid[0], [zfid[1]]);
const Logger2 = ModuleContainer.resolve(ZLoggerFactory).createZLogger(zmid[0], [zfid[2]]);
const Logger = new CoreLoggerFactory().createZLogger(zmid[1], [zfid[3], zfid[4]]);
const Logger4 = new CoreLoggerFactory().createZLogger(zmid[0], [zfid[5]]);
const Logger5 = new CoreLoggerFactory().createZLogger(zmid[1], [zfid[3], zfid[6]]);
const LoggerX = new CoreLoggerFactory().createZLogger(zmid[1], [zfid[3], zfid[4]]);

class TimeStart {
  constructor() {
    this._startTime = Date.now();
  }

  _showLog(content) {
    // Logger.zlg_info('hello', 2, 'tracking start', content);
    // Logger.zlg_infoR(99,12,'whottt', content);
    Logger.logSymbol(zLogFn[1], zsymbs[1], ztempls[0], 99, 12, content, x, ztempls._$entity(ztempls[1], name)); // Logger.zlg_info(`whottt ${templ} yeah`, content);

    Logger.logSymbol(zLogFn[0], zsymbs[2], ztempls[2], {
      h: 95
    }, () => x + y, p21, p31, 990, content1, `dont parse this`); // Logger.zlg_info(`${ha2} tracking start ${() => x2 + y2} ${p22} whot ${p32} really${know2}`, content2);

    Logger.logSymbol(zLogFn[0], zsymbs[3], ztempls[3], kk3, content3);
    Logger.logSymbol(zLogFn[0], zsymbs[4], ztempls[4], whot4, kk4, really4, () => 54, content); // Logger.zlg_info(
    //   `tracking start` + whot + `really${kk}` + really + 'who knows' + (() => x + 2),
    //   content
    // );
  }

  addLog(des, time = Date.now()) {
    this._showLog(des + ': ' + (time - this._startTime)); // Logger.zlg_info(
    //   'HELLO' + 'James ' + y + `. My name is ${name} Tracking start whot really${kk}`,
    //   content
    // );
    // Logger.zlg_infoR('HELLO' + ' ' + 'James ' + '' + `. My name is Tracking start whot really`);

  }

  initStartTime() {
    this._startTime = Date.now();
  }

}

const timeStart = new TimeStart();
export default timeStart;