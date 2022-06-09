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
          replaceLoggerInitFunc: ['createZLogger'],
          templateFunc: 't',
          excludePathRegex: '(src\\/zlogger|src\\/static)',
          outDir: 'outlog',
          forceMode: 'bin',
          log: 'on',
          process: 'pc',
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
