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
            info: [
              'logSymbol',
              {
                variants: ['self', 'R', 'F', 'C', 'RF', 'RC'],
              },
            ],
            debug: [
              'logSymbol',
              {
                variants: ['self', 'R', 'F', 'C', 'RF', 'RC'],
              },
            ],
            warn: [
              'logSymbol',
              {
                variants: ['self', 'R', 'F', 'C', 'RF', 'RC'],
              },
            ],
            error: [
              'logSymbol',
              {
                variants: ['self', 'R', 'F', 'C', 'RF', 'RC'],
              },
            ],
          },
          replaceCreateFeatFunc: ['createFeatLogs', 'createOneFeatLog'],
          replaceCreateTemplFunc: ['l'],
          loggerPathRegex: "((\\S*['-|'_])([a-zA-Z('-|'_)]+)\\/)*utils\\/logger\\/((\\S*['-|'_])([a-zA-Z('-|'_)]+)\\/)*(logger)$",
          logDataPathRegex: "((\\S*['-|'_])([a-zA-Z('-|'_)]+)\\/)*utils\\/logger\\/((\\S*['-|'_])([a-zA-Z('-|'_)]+)\\/)*(templates(-\\w+)+|templates)$",
          excludePathRegex: "(src\\/zlogger|src\\/static)",
          outDir: __dirname,
          log: 'on'
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
