/* eslint-disable */
const { zLogs: a, xp } = require('zlogger');
const PPP = a;
const x = require('zlogger2').C;
const { Y } = require('zlogger3'),
  { K, L } = require('zlogger4');
import { Loggers as W, LoggerDev } from 'some/path';
import { Logger } from 'some/path/renderer/core/logger';
import CheckX, { CheckY, CheckZ } from 'utils/another-logger';
import WhyCheck from 'utils/another-logger2';
import LoggerX from 'some/path/zya/ertf/add/logger';

const WhyCheckSub = WhyCheck;
const CrashNow = zLogs.createFeatLogs('boring', l => ({
  SUPER: l('TOP ME'),
}));
const MainLogs = {
  Cmd: zLogs.createFeatLogs('Cmd', function(l) {
    return {
      ARGV: l('recv {}'),
      DO_WITH_CMD: l('abc: {} {}'),
    };
  }),
  BoringTest: zLogs.createFeatLogs('boring', l => ({
    SUPER: l('very boring'),
  })),
  PreProcess: zLogs.createFeatLogs(null, l => ({
    RESET_DB: {
      RESET_DB_NESTED: {
        OK: l(' reset db ok'),
        ERROR: l('reset db error {} 2'),
      },
    },
    RESET_ME: {
      RESET_DB_NESTED: {
        OK: l('reset db ok 3'),
        ERROR: l('reset db error {} 4'),
      },
    },
    ANOTHER_ME: {
      ANOTHER_ME_1: {
        ANOTHER_ME_2: {
          ANOTHER_ME_3: {
            ANOTHER_ME_4: {
              OK: l('reset db ok 5'),
              ERROR: l('reset db error {} 6'),
            },
          },
        },
      },
    },
    ANOTHER_ME_ALONE: l('reset db ok 7'),
  })),
  ReadyLoadApp: zLogs.createOneFeatLog('ready', 'ready load app: {}'),
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

Loggers.Logger.infoF(MainManagerLogs.ShowLogin.SHOW, 'current', url);
Loggers.Logger.infoRF(MainManagerLogs.ShowLogin.SHOW, 'current', url);

const url = 'abc';

Loggers.Logger.infoF(MainManagerLogs.ShowLogin.SHOW, 'current', url);

LoggerX.Logger.debugF(MainManagerLogs.ShowLogin.SHOW, 'current', url);
