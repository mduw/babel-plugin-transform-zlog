// import chalk from 'chalk';

import normalizeOptions from './utils/normalizeOptions';
import transformCall from './transformers/call';
import { isNode } from './utils/environment';
import checkImports from './transformers/imports';
import { name } from '../package.json';
import { log } from './log';

const _SourceMap = new Map();
const _SymbolMap = new Map();
const _TemplMap = new Map();
const _ImportMap = new Map();
const prefixLog = `[${name}]`;
const CallVisitors = {
  CallExpression: transformCall,
  'ImportDeclaration|VariableDeclaration': checkImports,
};

const visitor = {
  Program: {
    enter(programPath, state) {
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
    this.ImportMap = _ImportMap;
    this.SymbolMap = _SymbolMap;
    this.SourceMap = _SourceMap;
    this.TemplMap = _TemplMap;
    this.currentFile = file.opts.filename;
    this.normalizedOpts = normalizeOptions(this.currentFile, this.opts);
    if(this.normalizedOpts.log === 'on') log(prefixLog, `scanning ${file.opts.filename}`);
  },

  visitor,

  post() {
    if (isNode) {
      /* dump parsed data to files */
      /* eslint-disable global-require */
      const {
        writeSourceMapSync,
        writeSymbolMapSync,
        // writeImports,
      } = require('./utils/file-utils');
      const path = require('path');
      const fs = require('fs');
      const fileExtension = '.json';
      writeSymbolMapSync(
        path.join(this.normalizedOpts.outDir, `log-symbol${fileExtension}`),
        this.SymbolMap,
        fs.constants.O_WRONLY
      );
      writeSourceMapSync(
        path.join(this.normalizedOpts.outDir, `log-source${fileExtension}`),
        this.SourceMap,
        fs.constants.O_WRONLY
      );
      writeSourceMapSync(
        path.join(this.normalizedOpts.outDir, `log-template${fileExtension}`),
        this.TemplMap,
        fs.constants.O_WRONLY
      );
      // for testing only
      // writeImports(
      //   path.join(this.normalizedOpts.outDir, `log-imports${fileExtension}`),
      //   this.ImportMap,
      //   fs.constants.O_WRONLY
      // );
    }

    /* CLEANUP */
    this.VisitedModules.clear();
    this.ImportMap.clear(); // per file
    if(this.normalizeOptions.log === 'on') log(prefixLog, `complete ${this.currentFile}`);
  },
});
