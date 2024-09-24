// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const execa = require('execa');
const glob = require('glob');
const waitOn = require('wait-on');
const { task } = require('../utils/gulp-utils.js');
const { parseArgs } = require('node:util');

module.exports = task('test:integ', async () => {
  const options = {
    shard: {
      // Must be in format {shard}/{totalShards} e.g. 1/3, 2/3, ... if there are 3 chunks.
      type: 'string',
    },
  };
  const shard = parseArgs({ options, strict: false }).values.shard;

  const devServer = execa('webpack', ['serve', '--config', 'pages/webpack.config.integ.js'], {
    env: {
      NODE_ENV: 'development',
    },
  });
  await waitOn({ resources: ['http://localhost:8080'] });

  const paths = createShards('src/**/__integ__/**/*.test.ts', [
    ['src/app-layout/__integ__/*.test.ts'],
    ['src/app-layout/visual-refresh-toolbar/__integ__/*.test.ts'],
    ['src/*chart/**/__integ__/**/*.test.ts', 'src/table/**/__integ__/**/*.test.ts'],
  ]);
  const files = shard ? paths[shard] : paths.all;
  if (!files) {
    throw new Error(`No path defined for shard "${shard}".`);
  }
  if (shard) {
    console.log(`Shard ${shard} includes:\n`, files);
  }
  await execa('jest', ['-c', 'jest.integ.config.js', ...files], {
    stdio: 'inherit',
    env: { ...process.env, NODE_OPTIONS: '--experimental-vm-modules' },
  });

  devServer.cancel();
});

function createShards(pathAll, shardChunks) {
  const shardsCount = shardChunks.length + 1;
  const mapping = { all: glob.sync(pathAll) };
  for (let shard = 1; shard <= shardChunks.length; shard++) {
    mapping[`${shard}/${shardsCount}`] = [...shardChunks[shard - 1].flatMap(path => glob.sync(path))];
  }
  mapping[`${shardsCount}/${shardsCount}`] = glob.sync(pathAll, { ignore: shardChunks.flatMap(path => path) });
  return mapping;
}
