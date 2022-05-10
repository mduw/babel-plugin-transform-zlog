import { types } from 'babel-core';

class LogIndexer {
  constructor() {
    this._mid = -1;
    this._fid = -1;
    this._lid = -1;
  }

  get mid() {
    return this._mid;
  }

  get fid() {
    return this._fid;
  }

  get lid() {
    return this._lid;
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

  currentLogData({ tags, lid, fid, process, template, sourcemap, row }) {
    let checkedTags;

    const baseTags = [
      types.objectProperty(types.identifier('process'), types.stringLiteral(process || 'unknown')),
      types.objectProperty(types.identifier('template'), types.stringLiteral(template)),
      types.objectProperty(types.identifier('sourcemap'), types.stringLiteral(sourcemap)),
      types.objectProperty(types.identifier('row'), types.numericLiteral(row)),
    ];

    if (tags) {
      tags.node.properties.push(...baseTags);
      checkedTags = tags.node.properties;
    } else {
      checkedTags = [...baseTags];
    }
    return types.objectExpression([
      types.objectProperty(types.identifier('mid'), types.numericLiteral(this._mid)),
      types.objectProperty(types.identifier('fid'), types.numericLiteral(fid || this._fid)),
      types.objectProperty(types.identifier('lid'), types.numericLiteral(lid || this._lid)),
      types.objectProperty(types.identifier('tags'), types.objectExpression(checkedTags)),
    ]);
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

  addOrGetMap(key, value, state) {
    let id;
    switch (key) {
      case 'mid': {
        if (state.ModuleMap.has(value)) {
          id = state.ModuleMap.get(value);
        } else {
          id = this.nextMID();
          state.ModuleMap.set(value, id);
        }
        break;
      }
      case 'fid': {
        if (state.FeatMap.has(value)) {
          id = state.FeatMap.get(value);
        } else {
          id = this.nextFID();
          state.FeatMap.set(value, id);
        }
        break;
      }
      case 'lid': {
        if (state.TemplMap.has(value)) {
          id = state.TemplMap.get(value);
        } else {
          id = this.nextLID();
          state.TemplMap.set(value, id);
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
