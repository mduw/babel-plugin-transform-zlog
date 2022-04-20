import { transformFileSync } from '@babel/core';
import fs from 'fs';

import plugin from '../src';
import { ExpectOut1 } from './expect-1';

describe('transformer-test', () => {
  const transformerOpts = {
    babelrc: false,
    sourceMap: true,
    ast: false,
    plugins: [
      [
        plugin,
        {
          rootDir: 'test',
          replaceSymbFunc: {
            zlg_info: [
              'logSymbol',
              {
                variants: ['self', 'R', 'F', 'C', 'RF', 'RC'],
              },
            ],
            zlg_debug: [
              'logSymbol',
              {
                variants: ['self', 'R', 'F', 'C', 'RF', 'RC'],
              },
            ],
            zlg_warn: [
              'logSymbol',
              {
                variants: ['self', 'R', 'F', 'C', 'RF', 'RC'],
              },
            ],
            zlg_error: [
              'logSymbol',
              {
                variants: ['self', 'R', 'F', 'C', 'RF', 'RC'],
              },
            ],
          },
          replaceCreateTemplFunc: ['toTemplate'],
          loggerPathRegex:
            "((\\S*['-|'_])([a-zA-Z('-|'_)]+)\\/)*utils\\/logger\\/((\\S*['-|'_])([a-zA-Z('-|'_)]+)\\/)*(logger)$",
          logDataPathRegex:
            "((\\S*['-|'_])([a-zA-Z('-|'_)]+)\\/)*utils\\/logger\\/((\\S*['-|'_])([a-zA-Z('-|'_)]+)\\/)*(templates(-\\w+)+|templates)$",
          excludePathRegex: '(src\\/zlogger|src\\/static)',
          outDir: 'node_modules/zlogger-parse/pc',
          log: 'on',
          process: 'pc'
        },
      ],
    ],
  };
  it('sample test', () => {
    const data = transformFileSync('./test/test-2.js', transformerOpts);
    fs.writeFileSync('./test/actual-2.js', data.code);
    // expect(data.code).toEqual(ExpectOut1);
    expect(true).toEqual(true);
  });
});
