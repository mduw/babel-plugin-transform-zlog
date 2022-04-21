/* eslint-disable */

const { zLogs } = require('zlogger');

const TrackingProcess = zLogs.createOneFeatLog('trackingPid', '[pid: {}][child: {}]');


/* eslint-disable */
const { zLogs: a, xp } = require('zlogger');
const PPP = a;
const x = require('zlogger').C;
const {mm,nn} = a;
const { Y } = require('zlogger'),
  { K, L } = require('zlogger');
import { Loggers as t, LoggerDev } from 'utils/logger';
import CheckX, {CheckY, CheckZ} from 'utils/another-logger';
import WhyCheck from 'utils/another-logger2';
import Logger from 'utils/logger/renderer/core/logger'
import BiggerLogger from 'utils/logger/db-task/logger'
const logger = what ? Logger.infoRC('[e2ee] ' + txt, extObj) : Logger.infoR('[e2ee] ' + txt);
const CrashNow = zLogs.createFeatLogs('boring', l => ({
	SUPER: l('TOP ME')
}));
const MainLogs = {
  Cmd: zLogs.createFeatLogs('Cmd', function(l) {
    return {
      ARGV: l('recv {}'),
      DO_WITH_CMD: l('doWithCmd: {} {}'),
    };
  }),
  BoringTest: zLogs.createFeatLogs('boring', l => ({
	  SUPER: l('very boring')
  })),
  PreProcess: zLogs.createFeatLogs(null, l => ({
    RESET_DB: {
      RESET_DB_NESTED: {
        OK: l('[db]_preProcess reset db ok'),
        ERROR: l('[db]_preProcess reset db error {} 2'),
      },
    },
    RESET_ME: {
      RESET_DB_NESTED: {
        OK: l('[db]_preProcess reset db ok 3'),
        ERROR: l('[db]_preProcess reset db error {} 4'),
      },
    },
    ANOTHER_ME: {
      ANOTHER_ME_1: {
        ANOTHER_ME_2: {
          ANOTHER_ME_3: {
            ANOTHER_ME_4: {
              OK: l('[db]_preProcess reset db ok 5'),
              ERROR: l('[db]_preProcess reset db error {} 6'),
            },
          },
        },
      },
    },
	ANOTHER_ME_ALONE: l('[db]_preProcess reset db ok 7'),
  })),
  ReadyLoadApp: zLogs.createOneFeatLog('readyLoad', 'readyToLoadApp: {}'),
};

Logger.info(MainManagerLogs.ShowLogin.SHOW, 'current', url);
Logger.infoR('sda', 'current', url);
Logger.infoRF('asre', 'current', url);
Logger.infoRC('34wq', 'current', url);
Logger.infoC(MainManagerLogs.ShowLogin.SHOW, 'current', url);
Logger.infoF(MainManagerLogs.ShowLogin.SHOW, 'current', url);

Logger.debug(MainManagerLogs.ShowLogin.SHOW, 'current', url);
Logger.debugR('1', 'current', url);
Logger.debugRF(2, 'current', url);
Logger.debugRC(3, 'current', url);
Logger.debugC(MainManagerLogs.ShowLogin.SHOW, 'current', url);
Logger.debugF(MainManagerLogs.ShowLogin.SHOW, 'current', url);

const MainManagerLogs = zLogs.createOneFeatLog('call-mng', '{}');

module.exports = {
  MainLogs,
  MainManagerLogs,
};

BiggerLogger.Loggers.Logger.infoF(MainManagerLogs.ShowLogin.SHOW, 'current', url);
Loggers.Logger.infoRF(MainManagerLogs.ShowLogin.SHOW, 'current', url);


const url = 'abc';
logger.zlg_errorRC(`invalid process import whot RAW`);

logger.zlg_errorRC(ZLogTemplate.toTemplate(`invalid process import whot quasis`));
logger.zlg_errorRC(ZLogTemplate.toTemplate('invalid process import whattt', {featName: 'canIUseSqlite'}));
logger.zlg_errorRC(ZLogTemplate.toTemplate('invalid process import whattt'));

this.logger.zlg_errorRC(ZLogTemplate.toTemplate('can not use sqlite adapter', {featName: 'canIUseSqlite', subFeat:'anysub'}), reason);
Loggers.infoF(MainManagerLogs.ShowLogin.SHOW, 'current', url);
