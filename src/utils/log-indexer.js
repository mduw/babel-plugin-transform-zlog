import { types } from 'babel-core';

class LogIndexer {
  constructor() {
    this._mid = -1;
    this._fid = -1;
    this._lid = -1;
    this._ntid = -1; // nametag id
  }

  keys = {
    templ: 'templ',
    module: 'module',
    feat: 'feat',
    nametag: 'nametag',
  };

  get mid() {
    return this._mid;
  }

  get fid() {
    return this._fid;
  }

  get lid() {
    return this._lid;
  }

  get ntid() {
    return this._ntid;
  }

  set mid(id) {
    this._mid = id;
  }

  set fid(id) {
    this._fid = id;
  }

  set lid(id) {
    this._lid = id;
  }

  set ntid(id) {
    this._ntid = id;
  }

  nextMID() {
    this._mid += 1;
    return this._mid;
  }

  nextFID() {
    this._fid += 1;
    return this._fid;
  }

  nextLID() {
    this._lid += 1;
    return this._lid;
  }

  nextNTID() {
    this._ntid += 1;
    return this._ntid;
  }

  addOrGetMap(key, value, state) {
    let id;
    switch (key) {
      case this.keys.module: {
        if (state.ModuleMap.has(value)) {
          id = state.ModuleMap.get(value);
        } else {
          id = this.nextMID();
          state.ModuleMap.set(value, id);
        }
        break;
      }
      case this.keys.feat: {
        if (state.FeatMap.has(value)) {
          id = state.FeatMap.get(value);
        } else {
          id = this.nextFID();
          state.FeatMap.set(value, id);
        }
        break;
      }
      case this.keys.templ: {
        if (state.TemplMap.has(value)) {
          id = state.TemplMap.get(value);
        } else {
          id = this.nextLID();
          state.TemplMap.set(value, id);
        }
        break;
      }

      case this.keys.nametag: {
        if (state.NameTagMap.has(value)) {
          id = state.NameTagMap.get(value);
        } else {
          id = this.nextNTID();
          state.NameTagMap.set(value, id);
        }
        break;
      }

      default: {
        id = -1;
      }
    }
    return id;
  }
}

const Indexer = new LogIndexer();
export { Indexer };
