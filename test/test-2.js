/* eslint-disable */

import ZCommon from 'utils/common';
import { ZLogTemplate } from 'zlogger';
import { CoreLoggerFactory } from 'utils/logger/renderer/core/logger';

const Logger0 = new CoreLoggerFactory().createZLogger('core-mngr', ['hello']);

const Logger3 = new CoreLoggerFactory().createZLogger('core-mngr', ['feat-funny']);
const Logger2 = ModuleContainer.resolve(ZLoggerFactory).createZLogger('core-mngr', [
  'feat-bording',
]);
const Logger = new CoreLoggerFactory().createZLogger('ui', ['sidebar', 'conv-list'], 'txt');
const Logger4 = new CoreLoggerFactory().createZLogger('core-mngr', ['feat-funny2']);
const Logger5 = new CoreLoggerFactory().createZLogger('ui', ['sidebar', 'conv-list2']);
const LoggerX = new CoreLoggerFactory().createZLogger('ui', ['sidebar', 'conv-list']);

class TimeStart {
  constructor() {
    this._startTime = Date.now();
  }

  _showLog(content) {
    const vers = '1.2.3';
    const x = 1;
    const e = 5;
    // Logger.zlg_info(
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

    Logger.zlg_info(__t`hello ${name} from world {}`, vers, 6, `template ${vers}`, 7, __raw`dont parse this ${name} string`);
    Logger.zlg_info(5, __t`hello ${name} from world {}`, vers, 6, `template ${vers}`, 7, __raw`dont parse this string`);

    // Logger.zlg_info('hello', 2, 'tracking start', content);
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
    this._showLog(des + ': ' + (time - this._startTime));
    // Logger.zlg_info(
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
