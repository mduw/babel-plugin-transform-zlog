const { nanoid } = require('nanoid');

export class UIDManager {
  static instance;

  _outLength = 8;

  constructor(outputLen) {
    if (UIDManager.instance) return UIDManager.instance;
    if (outputLen) {
      this._outLength = outputLen;
    }
    UIDManager.instance = this;
    return this;
  }

  get ID() {
    const id = nanoid(this._outLength);
    return id;
  }
}
