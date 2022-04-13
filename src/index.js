import normalizeOptions from './utils/normalizeOptions';
import transformCall from './transformers/call';
import { isNode } from './utils/environment';
import checkImports from './transformers/imports';
import { name } from '../package.json';
import { log } from './log';
import { isMatchingRegex } from './utils/regex-utils';
import { writeExtractedDataToFile } from './utils/file-utils';
import { invertObjectKeyValue } from './utils/object-utils';

const _SourceMap = new Map();
const _SymbolMap = new Map();
const _TemplMap = new Map();
let outDir;

const prefixLog = `[${name}]`;
const CallVisitors = {
  CallExpression: transformCall,
  'ImportDeclaration|VariableDeclaration': checkImports,
};

const visitor = {
  Program: {
    enter(programPath, state) {
      const ignorable = isMatchingRegex(this.normalizedOpts.excludePathRegex, this.currentFile);
      if (ignorable) {
        return;
      }
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
    this.ImportMap = new Map();
    this.SymbolMap = _SymbolMap;
    this.SourceMap = _SourceMap;
    this.TemplMap = _TemplMap;
    this.currentFile = file.opts.filename;
    this.normalizedOpts = normalizeOptions(this.currentFile, this.opts);
    if (this.normalizedOpts.log === 'on') log(prefixLog, `scanning ${file.opts.filename}`);
    outDir = this.normalizedOpts.outDir;
  },

  visitor,

  post() {
    /* CLEANUP */
    this.VisitedModules.clear();
    this.ImportMap.clear(); // per file
    if (this.normalizedOpts.log === 'on') log(prefixLog, `complete ${this.currentFile}`);
  },
});

/**
 * async
 * @param {*} param0
 * @returns
 */
export function getExtractedSymbolMap(options) {
  if (isNode && outDir) {
    return writeExtractedDataToFile([outDir, 'symbol-map.json'], _SourceMap, options);
  }
  throw new Error('Node env NOT found. Exec writeExtractedDataToFile failed');
}

/**
 * async
 * @param {*} param0
 * @returns
 */
export function getExtractedSourceMap(options) {
  if (isNode && outDir) {
    return writeExtractedDataToFile([outDir, 'source-map.json'], _SourceMap, options);
  }
  throw new Error('Node env NOT found. Exec writeExtractedDataToFile failed');
}

/**
 * async
 * @param {*} param0
 * @returns
 */
export function getExtractedTemplMap(options) {
  if (isNode && outDir) {
    return writeExtractedDataToFile([outDir, 'templ-map.json'], _TemplMap, options);
  }
  throw new Error('Node env NOT found. Exec writeExtractedDataToFile failed');
}
