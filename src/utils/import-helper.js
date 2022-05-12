import { types } from 'babel-core';
import { ParserError } from '../errors/errors';

class ImportHelper {
  insertKeys = {
    ztempls: 'ztempls',
    zsrcmaps: 'zsrcmaps',
    zsymbs: 'zsymbs',
    zmid: 'zmid',
    zfid: 'zfid',
    zLogFn: 'zLogFn',
  };

  insertedState = {
    ztempls: false,
    zsrcmaps: false,
    zsymbs: false,
    zmid: false,
    zfid: false,
    zLogFn: false,
  };

  reset() {
    this.insertedState = {
      ztempls: false,
      zsrcmaps: false,
      zsymbs: false,
      zmid: false,
      zfid: false,
      zLogFn: false,
    };
  }

  insertImports(programPath, key) {
    if (!Object.prototype.hasOwnProperty.call(this.insertKeys, key)) {
      throw new ParserError('Invalid import key');
    }

    if (this.insertedState[key]) return;
    this.insertedState[key] = true;
    const identifier = types.identifier(this.insertKeys[key]);
    const importDefaultSpecifier = types.importDefaultSpecifier(identifier);
    const importDeclaration = types.importDeclaration(
      [importDefaultSpecifier],
      types.stringLiteral(`log-buckets/${this.insertKeys[key]}`)
    );
    programPath.unshiftContainer('body', importDeclaration);
  }
}

export const ImportsHelper = new ImportHelper();
