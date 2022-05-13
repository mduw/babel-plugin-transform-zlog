import { types } from 'babel-core';
import { ParserError } from '../errors/errors';

class ImportHelper {
  defaultKeys = {
    ztempls: 'ztempls',
    zsrcmaps: 'zsrcmaps',
    zsymbs: 'zsymbs',
    zmid: 'zmid',
    zfid: 'zfid',
    zLogFn: 'zLogFn',
  };

  insertKeys = {};

  insertedState = {};

  initImportData(process) {
    this.process = process;
    Object.keys(this.defaultKeys).forEach(key => {
      this.insertKeys[`${key}${this.process}`] = `${key}${this.process}`;
      this.insertKeys[key] = `${key}${this.process}`;
    });
    Object.keys(this.defaultKeys).forEach(key => {
      this.insertedState[`${key}${this.process}`] = false;
      this.insertedState[key] = false;
    });
  }

  reset() {
    this.insertKeys = {};
    this.insertedState = {};
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
