import { invertObjectKeyValue, invertObjectKeyValueAsArray } from './object-utils';

const fs = require('fs');
const { isNode } = require('./environment');

export class OutputHandler {
  static instance;

  constructor(props) {
    if (OutputHandler.instance) return OutputHandler.instance;
    OutputHandler.instance = this;
    this.instance = this;

    this._SourceMap = (props && props.SourceMap) || null;
    this._TemplMap = (props && props.TemplMap) || null;
    this._NameTagMap = (props && props.NameTagMap) || null;

    this.outDir = '';
    this.outputable = false;

    return this;
  }

  setMaps(props) {
    if (!props) throw new Error('OutputHandler received invalid maps');
    try {
      const { SourceMap, NameTagMap, TemplMap, ModuleMap, FeatMap, EnumeratedLevels } = props;
      this._SourceMap = SourceMap;
      this._NameTagMap = NameTagMap;
      this._TemplMap = TemplMap;
    } catch (err) {
      throw new Error(`OutputHandler received invalid maps input ${err}`);
    }
  }

  get SourceMap() {
    return invertObjectKeyValueAsArray(Object.fromEntries(this._NameTagMap));
  }

  get NameTagMap() {
    return invertObjectKeyValueAsArray(Object.fromEntries(this._NameTagMap));
  }

  get TemplMap() {
    return invertObjectKeyValueAsArray(Object.fromEntries(this._TemplMap));
  }

  setOutDir(outDir) {
    if (!outDir) throw new Error('OutputHandler received invalid outDir');
    this.outDir = outDir;
  }

  getOutDir() {
    return this.outDir;
  }

  exportData() {
    if (!this.outDir) return;
    if (isNode) {
      const nametags = invertObjectKeyValue(Object.fromEntries(this._NameTagMap));
      const templates = invertObjectKeyValue(Object.fromEntries(this._TemplMap));
      const sourcemaps = invertObjectKeyValue(Object.fromEntries(this._SourceMap));
      const exportData = {
        nametags,
        templates,
        sourcemaps,
        build: process.env.ZLOG_BUILD_DETAILS || {
          branch: '',
          hash: '',
        },
      };
      fs.writeFileSync(this.outDir, JSON.stringify(exportData));
      return;
    }
    throw new Error('Node env NOT found. Exec writeExtractedDataToFile failed');
  }
}
