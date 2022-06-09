/* eslint-disable */
import ZCommon from 'utils/common';
import { ZLogTemplate } from 'zlogger';
import { CoreLoggerFactory } from 'utils/logger/renderer/core/logger';
const Logger0 = new CoreLoggerFactory().createZLogger("l6pnqodM");
const Logger3 = new CoreLoggerFactory().createZLogger("1jr-pjTV");
const Logger2 = ModuleContainer.resolve(ZLoggerFactory).createZLogger("jVOoe6mp");
const Logger = new CoreLoggerFactory().createZLogger("KE-bvS8k");
const Logger4 = new CoreLoggerFactory().createZLogger("WjtPPaSq");
const Logger5 = new CoreLoggerFactory().createZLogger("U8ov1xrD");
const LoggerX = new CoreLoggerFactory().createZLogger("KE-bvS8k");

class TimeStart {
  constructor() {
    this._startTime = Date.now();
  }

  _showLog(content) {
    const vers = '1.2.3';
    const x = 1;
    const e = 5; // Logger.zlg_info(
    //   '{} test log template {} v {} from convlist diffrent',
    //   x,
    //   () => 'style old',
    //   () => vers
    // );
    // Logger.zlg_info(`${x} test log template ${() => 'style 2'} v ${() => vers}` + ' from convlist');
    // Logger.zlg_info(
    //   x + ' test log template ' + (() => 'style 3') + ' v ' + vers + ' from convlist'
    // );
    // Logger.zlg_errorR(
    //   'this is error',
    //   __raw`error keep me the same`,
    //   __t`but parse me`,
    //   __t`parser more ${7}`
    // );

    Logger.zinfo(3, 44, "nM7gUpr_", x, () => 'style 2', () => vers, __t`whpt`, ' from convlist');

    __t('');

    Logger.zerror(21, 47, "0_zPzecx", kkk, kk, name, vers, x, 6, 8, 7, m);
    Logger.zdebug(15, 48, "vKUXc5y_", t`hello ${name} from world {}`, vers, 6, `template ${vers}`, 7);
    Logger.zerror(18, 49, `hello ${kkk} {} ${name} from world {}`, kk, vers, 6, 8, 7);
    Logger.zwarn(9, 50, "vKUXc5y_", t`hello ${name} from world {}`, vers, 6, `template ${vers}`, 7); // Logger.zlg_info('hello', 2, 'tracking start', content);
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