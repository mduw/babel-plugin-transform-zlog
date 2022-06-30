import fs from 'fs';
import normalizeOptions from './utils/normalizeOptions';
import transformCall from './transformers/call';
import { name } from '../package.json';
import { log, colorize, COLORS } from './utils/log/log';
import { isMatchingRegex } from './utils/regex-utils';
import { OutputHandler } from './utils/output-handler';
import { transformGlobalTagExpression } from './transformers/global-tag-expression';
import { getAbsPathFromRoot } from './utils/file-utils';
import { UIDManager } from './utils/id-gen';
import { invertObjectKeyValue } from './utils/object-utils';
import { Indexer } from './utils/log-indexer';

export const outputHandler = new OutputHandler();

const prefixLog = `[${name}]`;
const CallVisitors = {
  CallExpression: transformCall,
  // TaggedTemplateExpression: transformGlobalTagExpression,
};

const visitor = {
  Program: {
    enter(programPath, state) {
      this.programPath = programPath;
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
  name: 'babel-plugin-transform-zlog',
  manipulateOptions(opts) {
    if (opts.filename === undefined) {
      opts.filename = 'unknown';
    }
  },

  pre(file) {
    this.types = types;
    this.VisitedModules = new Set();
    this.NameTagMap = new Map();
    this.SourceMap = new Map();
    this.TemplMap = new Map();
    this.AliasMap = new Map();
    this.RowMap = new Map();

    this.ROOT = process.env.PWD;
    this.currentFile = getAbsPathFromRoot(this.ROOT, file.opts.filename);
    this.normalizedOpts = normalizeOptions(this.currentFile, this.opts);
    const outFilePath = this.normalizedOpts.outDir;
    if (fs.existsSync(outFilePath)) {
      const data = fs.readFileSync(outFilePath);
      const { nametags, templates, sourcemaps, rowmaps } = JSON.parse(data.toString());
      try {
        this.NameTagMap = new Map(Object.entries(invertObjectKeyValue(nametags)));
        this.SourceMap = new Map(Object.entries(invertObjectKeyValue(sourcemaps)));
        this.TemplMap = new Map(Object.entries(invertObjectKeyValue(templates)));
        this.RowMap = new Map(Object.entries(invertObjectKeyValue(rowmaps)));
      } catch {
        const [filename, ext] = outFilePath.split('.');
        const newFilePath = `[invalid_${new Date().getTime()}]${filename}.${ext}`;
        fs.copyFileSync(outFilePath, newFilePath);
      }
    }
    outputHandler.setOutDir(outFilePath);
    new UIDManager(8);

    if (this.normalizedOpts.log === 'on') {
      log(
        `[${new Date().toLocaleTimeString()}]`,
        prefixLog,
        '<==',
        this.currentFile,
        colorize('[parsing...]', COLORS.cyan)
      );
    }
  },

  visitor,

  post() {
    /* CLEANUP */
    if (Indexer.isUpdateRequied) {
      outputHandler.setMaps({
        SourceMap: Indexer.SourceMap,
        NameTagMap: Indexer.NameTagMap,
        TemplMap: Indexer.TemplMap,
        AliasMap: Indexer.AliasMap,
        RowMap: Indexer.RowMap,
      });
      outputHandler.exportData();
    }

    this.VisitedModules.clear();
    this.SourceMap.clear();
    this.TemplMap.clear();
    this.NameTagMap.clear();
    this.RowMap.clear();
    Indexer.reset();

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
