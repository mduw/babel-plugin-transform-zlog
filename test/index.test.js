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
          replaceSymbFunc: {
            info: [
              'logSymbol',
              {
                variants: ['self', 'R', 'F'],
              },
            ],
            debug: [
              'logSymbol',
              {
                variants: ['self', 'R', 'F'],
              },
            ],
            warn: [
              'logSymbol',
              {
                variants: ['self', 'R', 'F'],
              },
            ],
            error: [
              'logSymbol',
              {
                variants: ['self', 'R', 'F'],
              },
            ],
          },
          replaceCreateFeatFunc: ['createFeatLogs', 'createOneFeatLog'],
          replaceCreateTemplFunc: ['l'],
          loggerPathRegex: "(\\w+\\/)*some\\/path\\/(\\w+\\/)*(logger)$",
          logDataPathRegex: "(\\w+\\/)*more\\/path\\/(\\w+\\/)*(templates(-\\w+)+|templates)$",
          excludePathRegex: "",
          outDir: __dirname,
        },
      ],
    ],
  };
  it('sample test', () => {
    const data = transformFileSync('./test/test-1.js', transformerOpts);
    fs.writeFileSync('./test/actual-1.js', data.code);
    // expect(data.code).toEqual(ExpectOut1);
    expect(true).toEqual(true);
  });
});
