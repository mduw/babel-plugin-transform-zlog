import normalizeOptions from './utils/normalizeOptions';
import transformCall from './transformers/call';
import { name } from '../package.json';
import { log, colorize, COLORS } from './utils/log/log';
import { isMatchingRegex } from './utils/regex-utils';
import { OutputHandler } from './utils/output-handler';
import { transformGlobalTagExpression } from './transformers/global-tag-expression';
import { getAbsPathFromRoot } from './utils/file-utils';
import { UIDManager } from './utils/id-gen';

const _SourceMap = new Map();
const _NameTagMap = new Map();
const _TemplMap = new Map();

export const outputHandler = new OutputHandler();
// outputHandler.setMaps({
//   SourceMap: _SourceMap,
//   NameTagMap: _NameTagMap,
//   TemplMap: _TemplMap,
//   ModuleMap: _ModuleMap,
//   FeatMap: _FeatMap,
//   EnumeratedLevels,
// });

const prefixLog = `[${name}]`;
const CallVisitors = {
  CallExpression: transformCall,
  TaggedTemplateExpression: transformGlobalTagExpression,
};

const visitor = {
  Program: {
    enter(programPath, state) {
      this.programPath = programPath;
      const ignorable = isMatchingRegex(this.normalizedOpts.excludePathRegex, this.currentFile);
      if (ignorable) {
        return;
      }
      outputHandler.setOutputable(true);
      programPath.traverse(CallVisitors, state);
    },
    exit(programPath, state) {
      programPath.traverse(CallVisitors, state);
    },
  },
};

export default ({ types }) => ({
  name: 'babel-plugin-transform-zlog',
  manipulateOptions(opts) {
    if (opts.filename === undefined) {
      opts.filename = 'unknown';
    }
  },

  pre(file) {
    this.types = types;
    this.VisitedModules = new Set();
    this.NameTagMap = _NameTagMap;
    this.SourceMap = _SourceMap;
    this.TemplMap = _TemplMap;

    this.ROOT = 'C:/Users/LAP14763/Documents/work/zalosrc/babel-plugin-transform-log-template'; // process.pwd();
    this.currentFile = getAbsPathFromRoot(this.ROOT, file.opts.filename);
    this.normalizedOpts = normalizeOptions(this.currentFile, this.opts);

    outputHandler.setOutDir(this.normalizedOpts.outDir);
    new UIDManager(8);

    if (this.normalizedOpts.log === 'on') {
      log(
        `[${new Date().toLocaleTimeString()}]`,
        prefixLog,
        '==>',
        this.currentFile,
        colorize('[parsing...]', COLORS.cyan)
      );
    }
  },

  visitor,

  post() {
    /* CLEANUP */
    outputHandler.setMaps({
      SourceMap: _SourceMap,
      NameTagMap: _NameTagMap,
      TemplMap: _TemplMap,
    })
    outputHandler.exportData();

    this.VisitedModules.clear();

    if (this.normalizedOpts.log === 'on') {
      log(
        `[${new Date().toLocaleTimeString()}]`,
        prefixLog,
        '==>',
        this.currentFile,
        colorize('[completed]', COLORS.green)
      );
    }
  },
});
