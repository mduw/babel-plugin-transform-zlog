const { isNode } = require('./environment');
const { writeExtractedDataToFile } = require('./file-utils');

export class OutputHandler {
  constructor() {
    this._SourceMap = null;
    this._TemplMap = null;
    this._SymbolMap = null;
    this.outDir = null;
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
  getExtractedSymbolMap(options) {
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
  getExtractedSourceMap(options) {
    if (isNode) {
      return writeExtractedDataToFile([this.outDir, 'source-map.json'], this._SourceMap, options);
    }
    if (!this.outDir) {
      throw new Error('outDir found. Exec getExtractedSourceMap failed');
    }
    throw new Error('Node env NOT found. Exec writeExtractedDataToFile failed');
  }

  /**
   * async
   * @param {*} param0
   * @returns
   */
  getExtractedTemplMap(options) {
    if (isNode) {
      return writeExtractedDataToFile([this.outDir, 'templ-map.json'], this._TemplMap, options);
    }
    if (!this.outDir) {
      throw new Error('outDir found. Exec getExtractedTemplMap failed');
    }
    throw new Error('Node env NOT found. Exec writeExtractedDataToFile failed');
  }
}
