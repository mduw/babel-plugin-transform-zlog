import { invertObjectKeyValue, invertObjectKeyValueAsArray } from './object-utils';

const path = require('path');
const { isNode } = require('./environment');
const { writeExtractedDataToFile } = require('./file-utils');

export class OutputHandler {
  constructor() {
    if (this.instance) return this.instance;
    this.instance = this;
    this._SourceMap = null;
    this._TemplMap = null;
    this._SymbolMap = null;

    this._ModuleMap = null;
    this._FeatMap = null;
    this._EnumeratedLevels = null;
    this.outDir = '';
    this.outputable = false;
  }

  setMaps(props) {
    if (!props) throw new Error('OutputHandler received invalid maps');
    try {
      const { SourceMap, SymbolMap, TemplMap, ModuleMap, FeatMap, EnumeratedLevels } = props;
      this._SourceMap = SourceMap;
      this._SymbolMap = SymbolMap;
      this._TemplMap = TemplMap;

      this._ModuleMap = ModuleMap;
      this._FeatMap = FeatMap;
      this._EnumeratedLevels = EnumeratedLevels;
    } catch (err) {
      throw new Error(`OutputHandler received invalid maps input ${err}`);
    }
  }

  get SourceMap() {
    return invertObjectKeyValueAsArray(Object.fromEntries(this._SymbolMap));
  }

  get SymbolMap() {
    return invertObjectKeyValueAsArray(Object.fromEntries(this._SymbolMap));
  }

  get TemplMap() {
    return invertObjectKeyValueAsArray(Object.fromEntries(this._TemplMap));
  }

  get ModuleMap() {
    return invertObjectKeyValueAsArray(Object.fromEntries(this._ModuleMap));
  }

  get FeatMap() {
    return invertObjectKeyValueAsArray(Object.fromEntries(this._FeatMap));
  }

  get EnumeratedLevels() {
    return invertObjectKeyValueAsArray(this._EnumeratedLevels);
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
      const obj = invertObjectKeyValue(Object.fromEntries(this._SymbolMap));
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
      const obj = invertObjectKeyValue(Object.fromEntries(this._SourceMap));
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
      const obj = invertObjectKeyValue(Object.fromEntries(this._TemplMap));
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
      const obj = invertObjectKeyValue(Object.fromEntries(this._FeatMap));
      return writeExtractedDataToFile(path.join(this.outDir, 'feat-map.json'), obj, options);
    }
    throw new Error('Node env NOT found. Exec writeExtractedDataToFile failed');
  }
}
