export const ExpectOut1 = `/* eslint-disable */
const {
  zLogs
} = require('zlogger');

const x = require('zlogger');

const {
  Y
} = require('zlogger'),
      {
  K,
  L
} = require('zlogger');

import { Loggers, LoggerDev } from 'utils/logger';
import CheckX from 'utils/another-logger';
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
    featName: "readyLoad"
  }
};
Logger.logSymbol("info", 1, MainManagerLogs.ShowLogin.SHOW, 'current', url);
Logger.logSymbol("infoR", 2, 'sda', 'current', url);
Logger.logSymbol("infoRF", 3, 'asre', 'current', url);
Logger.logSymbol("infoRC", 4, '34wq', 'current', url);
Logger.logSymbol("infoC", 5, MainManagerLogs.ShowLogin.SHOW, 'current', url);
Logger.logSymbol("infoF", 6, MainManagerLogs.ShowLogin.SHOW, 'current', url);
Logger.logSymbol("debug", 7, MainManagerLogs.ShowLogin.SHOW, 'current', url);
Logger.logSymbol("debugR", 8, '1', 'current', url);
Logger.logSymbol("debugRF", 9, 2, 'current', url);
Logger.logSymbol("debugRC", 10, 3, 'current', url);
Logger.logSymbol("debugC", 11, MainManagerLogs.ShowLogin.SHOW, 'current', url);
Logger.logSymbol("debugF", 12, MainManagerLogs.ShowLogin.SHOW, 'current', url);
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
Loggers.Logger.logSymbol("infoF", 13, MainManagerLogs.ShowLogin.SHOW, 'current', url);
Loggers.Logger.logSymbol("infoRF", 14, MainManagerLogs.ShowLogin.SHOW, 'current', url);
const url = 'abc';
Loggers.Logger.logSymbol("infoF", 15, MainManagerLogs.ShowLogin.SHOW, 'current', url);`