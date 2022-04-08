/* eslint-disable */
const {
  zLogs: a,
  xp
} = require('zlogger');

const PPP = a;

const x = require('zlogger2').C;

const {
  Y
} = require('zlogger3'),
      {
  K,
  L
} = require('zlogger4');

import { Loggers as W, LoggerDev } from 'some/path';
import { Logger } from 'some/path/renderer/core/logger';
import CheckX, { CheckY, CheckZ } from 'utils/another-logger';
import WhyCheck from 'utils/another-logger2';
import LoggerX from 'some/path/zya/ertf/add/logger';
const WhyCheckSub = WhyCheck;
const CrashNow = {
  SUPER: {
    mid: -1,
    fid: 0,
    lid: 0,
    featName: "boring"
  }
};
const MainLogs = {
  Cmd: {
    ARGV: {
      mid: -1,
      fid: 1,
      lid: 1,
      featName: "Cmd"
    },
    DO_WITH_CMD: {
      mid: -1,
      fid: 1,
      lid: 2,
      featName: "Cmd"
    }
  },
  BoringTest: {
    SUPER: {
      mid: -1,
      fid: 2,
      lid: 3,
      featName: "boring"
    }
  },
  PreProcess: {
    RESET_DB: {
      RESET_DB_NESTED: {
        OK: {
          mid: -1,
          fid: 3,
          lid: 4,
          featName: ""
        },
        ERROR: {
          mid: -1,
          fid: 3,
          lid: 5,
          featName: ""
        }
      }
    },
    RESET_ME: {
      RESET_DB_NESTED: {
        OK: {
          mid: -1,
          fid: 3,
          lid: 6,
          featName: ""
        },
        ERROR: {
          mid: -1,
          fid: 3,
          lid: 7,
          featName: ""
        }
      }
    },
    ANOTHER_ME: {
      ANOTHER_ME_1: {
        ANOTHER_ME_2: {
          ANOTHER_ME_3: {
            ANOTHER_ME_4: {
              OK: {
                mid: -1,
                fid: 3,
                lid: 8,
                featName: ""
              },
              ERROR: {
                mid: -1,
                fid: 3,
                lid: 9,
                featName: ""
              }
            }
          }
        }
      }
    },
    ANOTHER_ME_ALONE: {
      mid: -1,
      fid: 3,
      lid: 10,
      featName: ""
    }
  },
  ReadyLoadApp: {
    mid: -1,
    fid: 4,
    lid: 11,
    featName: "ready"
  }
};
Logger.logSymbol("info", 1, MainManagerLogs.ShowLogin.SHOW, 'current', url);
Logger.logSymbol("infoR", 2, 'sda', 'current', url);
Logger.infoRF('asre', 'current', url);
Logger.infoRC('34wq', 'current', url);
Logger.infoC(MainManagerLogs.ShowLogin.SHOW, 'current', url);
Logger.logSymbol("infoF", 3, MainManagerLogs.ShowLogin.SHOW, 'current', url);
Logger.logSymbol("debug", 4, MainManagerLogs.ShowLogin.SHOW, 'current', url);
Logger.logSymbol("debugR", 5, '1', 'current', url);
Logger.debugRF(2, 'current', url);
Logger.debugRC(3, 'current', url);
Logger.debugC(MainManagerLogs.ShowLogin.SHOW, 'current', url);
Logger.logSymbol("debugF", 6, MainManagerLogs.ShowLogin.SHOW, 'current', url);
const MainManagerLogs = {
  mid: -1,
  fid: 5,
  lid: 12,
  featName: "call-mng"
};
module.exports = {
  MainLogs,
  MainManagerLogs
};
Loggers.Logger.infoF(MainManagerLogs.ShowLogin.SHOW, 'current', url);
Loggers.Logger.infoRF(MainManagerLogs.ShowLogin.SHOW, 'current', url);
const url = 'abc';
Loggers.Logger.infoF(MainManagerLogs.ShowLogin.SHOW, 'current', url);
LoggerX.Logger.logSymbol("debugF", 7, MainManagerLogs.ShowLogin.SHOW, 'current', url);