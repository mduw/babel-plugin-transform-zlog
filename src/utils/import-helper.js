import { types } from 'babel-core';
import { ParserError } from '../errors/errors';
import { outputHandler } from './output-handler';


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

  initImportData() {
    Object.keys(this.defaultKeys).forEach(key => {
      this.insertKeys[
        `${key}${outputHandler.process}`
      ] = `${key}${outputHandler.process}`;
      this.insertKeys[key] = `${key}${outputHandler.process}`;
    });
    Object.keys(this.defaultKeys).forEach(key => {
      this.insertedState[`${key}${outputHandler.process}`] = false;
      this.insertedState[key] = false;
    });
  }

  reset() {
    Object.keys(this.defaultKeys).forEach(key => {
      this.insertedState[`${key}${outputHandler.process}`] = false;
      this.insertedState[key] = false;
    });
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
