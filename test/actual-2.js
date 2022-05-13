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
    const vers = '1.2.3';
    const x = 1;
    const e = 5;
    Logger.logSymbol(zLogFn[0], zsymbs[1], ztempls[0], x, () => 'style old', () => vers);
    Logger.logSymbol(zLogFn[0], zsymbs[2], ztempls[1], x, () => 'style 2', () => vers);
    Logger.logSymbol(zLogFn[0], zsymbs[3], ztempls[1], x, () => 'style 3', vers);
    Logger.logSymbol(zLogFn[16], zsymbs[4], ztempls[2], `error keep me the same`, ztempls._$entity(ztempls[3]), ztempls._$entity(ztempls[4], 7));
    Logger.logSymbol(zLogFn[0], zsymbs[5], ztempls[5], vers, 6, vers, 7, `dont parse this string`); // Logger.zlg_info('hello', 2, 'tracking start', content);
    // Logger.zlg_infoR(99,12,'whottt', content);
    // Logger.zlg_infoR(99, 12, 'whottt', content, x, __t`hello ${name}`);
    // // Logger.zlg_info(`whottt ${templ} yeah`, content);
    // Logger.zlg_info(
    //   { h: 95 },
    //   `tracking start ${() => x + y} ${p21} whot ${p31} really${990}`,
    //   content1,
    //   __raw`dont parse this`
    // );
    // // Logger.zlg_info(`${ha2} tracking start ${() => x2 + y2} ${p22} whot ${p32} really${know2}`, content2);
    // Logger.zlg_info(`tracking start whot really${kk3}`, content3);
    // Logger.zlg_info(
    //   `tracking start` + whot4 + `really${kk4}` + really4 + 'who knows' + (() => 54),
    //   content
    // );
    // Logger.zlg_info(
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