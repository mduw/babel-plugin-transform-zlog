import { UIDManager } from './id-gen';

class LogIndexer {
  static instance;

  constructor() {
    if (LogIndexer.instance) return LogIndexer.instance;
    LogIndexer.instance = this;

    this._uidManager = new UIDManager();

    this._NewSourceMap = new Map();
    this._NewNameTagMap = new Map();
    this._NewTemplMap = new Map();
    this._NewAliasMap = new Map();
    this._NewRowMap = new Map();
    this._updateFlag = false;
    return this;
  }

  get SourceMap() {
    return this._NewSourceMap;
  }

  get NameTagMap() {
    return this._NewNameTagMap;
  }

  get TemplMap() {
    return this._NewTemplMap;
  }

  get AliasMap() {
    return this._NewAliasMap;
  }

  get RowMap() {
    return this._NewRowMap;
  }

  get isUpdateRequied() {
    return this._updateFlag === true;
  }

  keys = {
    templ: 'templ',
    module: 'module',
    feat: 'feat',
    nametag: 'nametag',
    sourcemap: 'sourcemap',
    aliasmap: 'aliasmap',
    rowmap: 'rowmap',
  };

  reset() {
    this._NewNameTagMap.clear();
    this._NewSourceMap.clear();
    this._NewTemplMap.clear();
    this._NewAliasMap.clear();
    this._NewRowMap.clear();
    this._updateFlag = false;
  }

  addOrGetMap(key, value, state) {
    let id;
    switch (key) {
      case this.keys.templ: {
        if (this._NewTemplMap.has(value)) {
          id = this._NewTemplMap.get(value);
        } else if (state.TemplMap.has(value)) {
          id = state.TemplMap.get(value);
          this._NewTemplMap.set(value, id);
        } else {
          id = this._uidManager.ID;
          this._NewTemplMap.set(value, id);
          this._updateFlag = true;
        }
        break;
      }

      case this.keys.nametag: {
        if (this._NewNameTagMap.has(value)) {
          id = this._NewNameTagMap.get(value);
        } else if (state.NameTagMap.has(value)) {
          id = state.NameTagMap.get(value);
          this._NewNameTagMap.set(value, id);
        } else {
          id = this._uidManager.ID;
          this._NewNameTagMap.set(value, id);
          this._updateFlag = true;
        }
        break;
      }

      case this.keys.sourcemap: {
        if (this._NewSourceMap.has(value)) {
          id = this._NewSourceMap.get(value);
        } else if (state.SourceMap.has(value)) {
          id = state.SourceMap.get(value);
          this._NewSourceMap.set(value, id);
        } else {
          id = this._uidManager.ID;
          this._NewSourceMap.set(value, id);
          this._updateFlag = true;
        }
        break;
      }

      case this.keys.aliasmap: {
        const val = JSON.stringify(value).toString();
        if (this._NewAliasMap.has(val)) {
          id = this._NewAliasMap.get(val);
        } else if (state.AliasMap.has(val)) {
          id = state.AliasMap.get(val);
          this._NewAliasMap.set(val, id);
        } else {
          id = this._uidManager.ID;
          this._NewAliasMap.set(val, id);
          this._updateFlag = true;
        }
        break;
      }

      case this.keys.rowmap: {
        const val = JSON.stringify(value).toString();
        if (this._NewRowMap.has(val)) {
          id = this._NewRowMap.get(val);
        } else if (state.RowMap.has(val)) {
          id = state.RowMap.get(val);
          this._NewRowMap.set(val, id);
        } else {
          id = this._uidManager.ID;
          this._NewRowMap.set(val, id);
          this._updateFlag = true;
        }
        break;
      }

      default: {
        id = this._uidManager.ID;
      }
    }
    return id;
  }
}

const Indexer = new LogIndexer();
export { Indexer };
