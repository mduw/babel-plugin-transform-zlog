import { UIDManager } from './id-gen';

class LogIndexer {
  static instance;

  constructor() {
    if (LogIndexer.instance) return LogIndexer.instance;
    LogIndexer.instance = this;
    // this._mid = -1;
    // this._fid = -1;
    // this._lid = -1;
    // this._ntid = -1; // nametag id
    // this._sourcemapid = -1;
    this._uidManager = new UIDManager();
    return this;
  }

  keys = {
    templ: 'templ',
    module: 'module',
    feat: 'feat',
    nametag: 'nametag',
    sourcemap: 'sourcemap',
  };

  // get mid() {
  //   return this._mid;
  // }

  // get fid() {
  //   return this._fid;
  // }

  // get lid() {
  //   return this._lid;
  // }

  // get ntid() {
  //   return this._ntid;
  // }

  // set mid(id) {
  //   this._mid = id;
  // }

  // set fid(id) {
  //   this._fid = id;
  // }

  // set lid(id) {
  //   this._lid = id;
  // }

  // set ntid(id) {
  //   this._ntid = id;
  // }

  // set sourcemapid(id) {
  //   this._sourcemapid = id;
  // }

  // nextMID() {
  //   this._mid += 1;
  //   return this._mid;
  // }

  // nextFID() {
  //   this._fid += 1;
  //   return this._fid;
  // }

  // nextLID() {
  //   this._lid += 1;
  //   return this._lid;
  // }

  // nextNTID() {
  //   this._ntid += 1;
  //   return this._ntid;
  // }

  // nextSourceMapID() {
  //   this._sourcemapid += 1;
  //   return this._sourcemapid;
  // }

  addOrGetMap(key, value, state) {
    let id;
    switch (key) {
      case this.keys.module: {
        if (state.ModuleMap.has(value)) {
          id = state.ModuleMap.get(value);
        } else {
          // id = this.nextMID();
          id = this._uidManager.ID;
          id = state.ModuleMap.set(value, id);
        }
        break;
      }
      case this.keys.feat: {
        if (state.FeatMap.has(value)) {
          id = state.FeatMap.get(value);
        } else {
          // id = this.nextFID();
          id = this._uidManager.ID;
          state.FeatMap.set(value, id);
        }
        break;
      }
      case this.keys.templ: {
        if (state.TemplMap.has(value)) {
          id = state.TemplMap.get(value);
        } else {
          // id = this.nextLID();
          id = this._uidManager.ID;
          state.TemplMap.set(value, id);
        }
        break;
      }

      case this.keys.nametag: {
        if (state.NameTagMap.has(value)) {
          id = state.NameTagMap.get(value);
        } else {
          // id = this.nextNTID();
          id = this._uidManager.ID;
          state.NameTagMap.set(value, id);
        }
        break;
      }

      case this.keys.sourcemap: {
        if (state.SourceMap.has(value)) {
          id = state.SourceMap.get(value);
        } else {
          // id = this.nextSourceMapID();
          id = this._uidManager.ID;
          state.SourceMap.set(value, id);
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
