const { isNode } = require('./environment');
const { writeExtractedDataToFile } = require('./file-utils');

export class OutputHandler {
  constructor() {
    if (this.instance) return this.instance;
    this.instance = this;
    this._SourceMap = null;
    this._TemplMap = null;
    this._SymbolMap = null;
    this.outDir = '';
  }

  setMaps(props) {
    if (!props) throw new Error('OutputHandler received invalid maps');
    try {
      const { SourceMap, TemplMap, SymbolMap } = props;
      this._SourceMap = SourceMap;
      this._TemplMap = TemplMap;
      this._SymbolMap = SymbolMap;
    } catch (err) {
      throw new Error(`OutputHandler received invalid maps input ${err}`);
    }
  }

  setOutDir(outDir) {
    if (!outDir) throw new Error('OutputHandler received invalid outDir');
    this.outDir = outDir;
  }

  getOutDir() {
    return this.outDir;
  }

  /**
   * async
   * @param {*} param0
   * @returns
   */
  writeExtractedSymbolMap(options) {
    if(!this.outDir) return new Promise(resolve => resolve(true));
    if (isNode) {
      return writeExtractedDataToFile([this.outDir, 'symbol-map.json'], this._SymbolMap, options);
    }
    throw new Error('Node env NOT found. Exec writeExtractedDataToFile failed');
  }

  /**
   * async
   * @param {*} param0
   * @returns
   */
  writeExtractedSourceMap(options) {
    if(!this.outDir) return new Promise(resolve => resolve(true));
    if (isNode) {
      return writeExtractedDataToFile([this.outDir, 'source-map.json'], this._SourceMap, options);
    }
    throw new Error('Node env NOT found. Exec writeExtractedDataToFile failed');
  }

  /**
   * async
   * @param {*} param0
   * @returns
   */
  writeExtractedTemplMap(options) {
    if(!this.outDir) return new Promise(resolve => resolve(true));
    if (isNode) {
      return writeExtractedDataToFile([this.outDir, 'templ-map.json'], this._TemplMap, options);
    }
    throw new Error('Node env NOT found. Exec writeExtractedDataToFile failed');
  }
}
