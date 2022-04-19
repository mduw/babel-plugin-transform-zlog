import normalizeOptions from './utils/normalizeOptions';
import transformCall from './transformers/call';
import { name } from '../package.json';
import { log } from './log';
import { isMatchingRegex } from './utils/regex-utils';
import { OutputHandler } from './utils/output-handler';

const _SourceMap = new Map();
const _SymbolMap = new Map();
const _TemplMap = new Map();

const _FeatMap = new Map();
export const outputHandler = new OutputHandler();
outputHandler.setMaps({
  SourceMap: _SourceMap,
  SymbolMap: _SymbolMap,
  TemplMap: _TemplMap,
  FeatMap: _FeatMap
});

const prefixLog = `[${name}]`;
const CallVisitors = {
  CallExpression: transformCall,
};

const visitor = {
  Program: {
    enter(programPath, state) {
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
  name: 'babel-plugin-transform-test',
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
    this.FeatMap = _FeatMap;
    this.currentFile = file.opts.filename;
    this.normalizedOpts = normalizeOptions(this.currentFile, this.opts);
    outputHandler.setOutDir([this.normalizedOpts.outDir, this.normalizedOpts.process]);
    if (this.normalizedOpts.log === 'on') log(prefixLog, `scanning ${file.opts.filename}`);
  },

  visitor,

  post() {
    /* CLEANUP */
    this.VisitedModules.clear();
    if (this.normalizedOpts.log === 'on') log(prefixLog, `complete ${this.currentFile}`);
  },
});
