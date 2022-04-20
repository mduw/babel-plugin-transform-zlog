import { invertObjectKeyValue } from './object-utils';

const path = require('path');
const { isNode } = require('./environment');
const { writeExtractedDataToFile, toPosixPath } = require('./file-utils');

export class OutputHandler {
  constructor() {
    if (this.instance) return this.instance;
    this.instance = this;
    this._SourceMap = null;
    this._TemplMap = null;
    this._SymbolMap = null;
    this._FeatMap = null;
    this.outDir = '';
    this.outputable = false;

    this._outputSourceMap = null;
    this._outputTemplMap = null;
    this._outputSymbolMap = null;
    this._outputFeatMap = null;
  }

  setMaps(props) {
    if (!props) throw new Error('OutputHandler received invalid maps');
    try {
      const { SourceMap, TemplMap, SymbolMap, FeatMap } = props;
      this._SourceMap = SourceMap;
      this._TemplMap = TemplMap;
      this._SymbolMap = SymbolMap;
      this._FeatMap = FeatMap;
    } catch (err) {
      throw new Error(`OutputHandler received invalid maps input ${err}`);
    }
  }

  setOutputable(status) {
    this.outputable = status;
  }

  setOutDir(outDir) {
    if (!outDir) throw new Error('OutputHandler received invalid outDir');
    this.outDir = outDir;
  }

  getOutDir() {
    return this.outDir;
  }

  getSourceMap(key) {
    return this._outputSourceMap.get(key);
  }

  getTemplMap(key) {
    console.log('getting  templ', key, Object.fromEntries(this._outputTemplMap))
    return this._outputTemplMap.get(key);
  }

  getSymbolMap(key) {
    return this._outputSymbolMap.get(key);
  }

  isOutputable() {
    return this.outputable;
  }

  /**
   * async
   * @param {*} param0
   * @returns
   */
  writeExtractedSymbolMap(options) {
    if (!this.outDir) return new Promise(resolve => resolve(true));
    if (isNode) {
      const { map, obj } = invertObjectKeyValue(Object.fromEntries(this._SymbolMap));
      this._outputSymbolMap = map;

      return writeExtractedDataToFile(path.join(this.outDir, 'symbol-map.json'), obj, options);
    }
    throw new Error('Node env NOT found. Exec writeExtractedDataToFile failed');
  }

  /**
   * async
   * @param {*} param0
   * @returns
   */
  writeExtractedSourceMap(options) {
    if (!this.outDir) return new Promise(resolve => resolve(true));
    if (isNode) {
      const { map, obj } = invertObjectKeyValue(Object.fromEntries(this._SourceMap));
      this._outputSourceMap = map;
      return writeExtractedDataToFile(path.join(this.outDir, 'source-map.json'), obj, options);
    }
    throw new Error('Node env NOT found. Exec writeExtractedDataToFile failed');
  }

  /**
   * async
   * @param {*} param0
   * @returns
   */
  writeExtractedTemplMap(options) {
    if (!this.outDir) return new Promise(resolve => resolve(true));
    if (isNode) {
      const { obj, map } = invertObjectKeyValue(Object.fromEntries(this._TemplMap));
      this._outputTemplMap = map;
      return writeExtractedDataToFile(path.join(this.outDir, 'templ-map.json'), obj, options);
    }
    throw new Error('Node env NOT found. Exec writeExtractedDataToFile failed');
  }

  /**
   * async
   * @param {*} param0
   * @returns
   */
  writeExtractedFeatMap(options) {
    if (!this.outDir) return new Promise(resolve => resolve(true));
    if (isNode) {
      const { obj, map } = invertObjectKeyValue(Object.fromEntries(this._FeatMap));
      this._outputFeatMap = map;
      return writeExtractedDataToFile(path.join(this.outDir, 'feat-map.json'), obj, options);
    }
    throw new Error('Node env NOT found. Exec writeExtractedDataToFile failed');
  }
}
