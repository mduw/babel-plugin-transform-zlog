/* eslint-disable */

import ZCommon from 'utils/common';
import {ZLogTemplate} from 'zlogger';
import {CoreLoggerFactory} from 'utils/logger/renderer/core/logger';

const Logger0 = new CoreLoggerFactory().createZLogger('core-mngr', ['hello']);

const Logger3 = new CoreLoggerFactory().createZLogger('core-mngr', ['feat-funny']);
const Logger2 = ModuleContainer.resolve(ZLoggerFactory).createZLogger('core-mngr', ['feat-bording']);
const Logger = new CoreLoggerFactory().createZLogger('ui', ['sidebar', 'conv-list']);
const Logger4 = new CoreLoggerFactory().createZLogger('core-mngr', ['feat-funny2']);
const Logger5 = new CoreLoggerFactory().createZLogger('ui', ['sidebar', 'conv-list2']);
const LoggerX = new CoreLoggerFactory().createZLogger('ui', ['sidebar', 'conv-list']);

class TimeStart {
    constructor() {
        this._startTime = Date.now();
    }

    _showLog(content) {
        Logger.zlg_info('tracking start {}', content);
        Logger.zlg_infoR('whottt', content);
        // Logger.zlg_info(`whottt ${templ} yeah`, content);
        Logger.zlg_info(`tracking start ${()=>(x+y)} ${p2} whot ${p3} really`, content);
        Logger.zlg_info(`${ha} tracking start ${()=>(x+y)} ${p2} whot ${p3} really${know}`, content);
        Logger.zlg_info(`tracking start whot really${kk}`, content);
        Logger.zlg_info(`tracking start` + whot + `really${kk}` + really + 'who knows' + (() => 5), content);
    }

    addLog(des, time = Date.now()) {
        this._showLog(des + ": " +  (time - this._startTime));
        Logger.zlg_info("HELLO" + 'James ' + y + `. My name is ${name} Tracking start whot really${kk}`, content);
        Logger.zlg_info("HELLO"+ ' ' + 'James ' + '' + `. My name is Tracking start whot really`);

    }

    initStartTime() {
        this._startTime = Date.now();
    }
}

const timeStart = new TimeStart();
export default timeStart;