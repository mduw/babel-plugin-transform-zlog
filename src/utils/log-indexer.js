import { UIDManager } from './id-gen';

class LogIndexer {
  static instance;

  constructor() {
    if (LogIndexer.instance) return LogIndexer.instance;
    LogIndexer.instance = this;

    this._uidManager = new UIDManager();

    this._updateFlag = false;
    return this;
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
    this._updateFlag = false;
  }

  addOrGetMap(key, value, state) {
    let id;
    switch (key) {
      case this.keys.templ: {
        if (state.TemplMap.has(value)) {
          id = state.TemplMap.get(value);
        } else {
          id = this._uidManager.ID;
          state.TemplMap.set(value, id);
          this._updateFlag = true;
        }
        break;
      }

      case this.keys.nametag: {
        if (state.NameTagMap.has(value)) {
          id = state.NameTagMap.get(value);
        } else {
          id = this._uidManager.ID;
          state.NameTagMap.set(value, id);
          this._updateFlag = true;
        }
        break;
      }

      case this.keys.sourcemap: {
        if (state.SourceMap.has(value)) {
          id = state.SourceMap.get(value);
        } else {
          id = this._uidManager.ID;
          state.SourceMap.set(value, id);
          this._updateFlag = true;
        }
        break;
      }

      case this.keys.aliasmap: {
        const val = JSON.stringify(value).toString();
        if (state.AliasMap.has(val)) {
          id = state.AliasMap.get(val);
        } else {
          id = this._uidManager.ID;
          state.AliasMap.set(val, id);
          this._updateFlag = true;
        }
        break;
      }

      case this.keys.rowmap: {
        const val = JSON.stringify(value).toString();
        if (state.RowMap.has(val)) {
          id = state.RowMap.get(val);
        } else {
          id = this._uidManager.ID;
          state.RowMap.set(val, id);
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
