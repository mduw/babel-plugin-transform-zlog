import { colorize, COLORS } from '../utils/log/color';

export class ParserError {
  constructor(...args) {
    this.msg = args.join(' ');
  }

  get error() {
    const prefix = `\n[${new Date().toLocaleTimeString()}][babel-plugin-transform-zlog]`;
    return new Error(colorize(`${prefix}: ${this.msg}`, COLORS.red));
  }
}

export class TransformInitLoggerError extends ParserError {
  constructor(...args) {
    super(...args);
    this.msg = 'SYNTAX ERR: '.concat(args.join(' ')).concat(this.details());
  }

  details = () =>
    `\n\n\t${colorize(
      '=> EXPECTED: createZLogger(module:string, feature: string[], mode?: "bin|"txt")\n',
      COLORS.magenta
    )}`;
}

export class TransformSymbolLogError extends ParserError {
  constructor(funcName, ...args) {
    super(args);
    this.msg = 'logSymbol Syntax ERR: '.concat(args.join(' ')).concat(this.details(funcName));
  }

  details = funcName =>
    `\n\n\t${colorize(
      `=> EXPECTED: ${funcName}(<template>, ...args)\n\t\t<template>: string | template string | string/template-string concatenation`,
      COLORS.magenta
    )}`;
}

export class TransformTemplateError extends ParserError {
  constructor(funcName, ...args) {
    super(args);
    this.msg = `${funcName} Syntax ERR: `.concat(args.join(' ')).concat(this.details(funcName));
  }

  details = funcName =>
    `\n\n\t${colorize(
      `=> EXPECTED: ${colorize(`${funcName}\`template\``, COLORS.yellow)} OR ${colorize(
        `${funcName}('template')`,
        COLORS.yellow
      )} OR ${colorize(`${funcName}(\`template\`)`, COLORS.yellow)}`,
      COLORS.magenta
    )}`;
}
