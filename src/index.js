import normalizeOptions from './utils/normalizeOptions';
import transformCall from './transformers/call';
import { name } from '../package.json';
import { log, colorize, COLORS } from './utils/log/log';
import { isMatchingRegex } from './utils/regex-utils';
import { OutputHandler } from './utils/output-handler';
import { ImportsHelper } from './utils/import-helper';
import { EnumeratedLevels } from './utils/log-levels/enumerator';
import { transformGlobalTagExpression } from './transformers/global-tag-expression';

const _SourceMap = new Map();
const _SymbolMap = new Map();
const _TemplMap = new Map();
const _ModuleMap = new Map();
const _FeatMap = new Map();

export const outputHandler = new OutputHandler();
outputHandler.setMaps({
  SourceMap: _SourceMap,
  SymbolMap: _SymbolMap,
  TemplMap: _TemplMap,
  ModuleMap: _ModuleMap,
  FeatMap: _FeatMap,
  EnumeratedLevels,
});

const prefixLog = `[${name}]`;
const CallVisitors = {
  TaggedTemplateExpression: transformGlobalTagExpression,
  CallExpression: transformCall,

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
    this.SymbolMap = _SymbolMap;
    this.SourceMap = _SourceMap;
    this.TemplMap = _TemplMap;

    this.ModuleMap = _ModuleMap;
    this.FeatMap = _FeatMap;
    this.currentFile = file.opts.filename;
    this.normalizedOpts = normalizeOptions(this.currentFile, this.opts);
    outputHandler.setOutDir(this.normalizedOpts.outDir);
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
    ImportsHelper.reset();
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
