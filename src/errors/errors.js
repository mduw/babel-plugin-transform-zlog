import { colorize, COLORS } from '../utils/log/color';

export class ParserError {
  constructor(...args) {
    this.msg = args.join(' ');
  }

  get error() {
    const prefix = `\n[${colorize(new Date().toLocaleTimeString(), COLORS.yellow)}][${colorize(
      'babel-plugin-transform-zlog',
      COLORS.yellow
    )}]`;
    return new Error(`${prefix}: ${this.msg}`);
  }
}

export class TransformInitLoggerError extends ParserError {
  details = `\n\n\t=> ${colorize('!IMPORTANT', COLORS.BGred, COLORS.white)}: ${colorize(
    'expect createZLogger(<template>, ...args)\n\t\t<template> must be a string | template string | string/template-string concatenation',
    COLORS.yellow
  )}`;

  constructor(...args) {
    super(...args);
    this.msg = colorize(
      'SYNTAX ERR: '.concat(args.join(' ')),
      COLORS.red
    ).concat(this.details);
  }
}

export class TransformSymbolLogError extends ParserError {
  constructor(...args) {
    super(args);
    this.msg = colorize('logSymbol Syntax ERR: '.concat(args.join(' ')), COLORS.red);
  }
}
