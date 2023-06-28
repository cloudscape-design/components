// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { parallel } = require('gulp');
const execa = require('execa');
const themes = require('../utils/themes');
const { task } = require('../utils/gulp-utils');

function compileTypescript(theme) {
  return task(`typescript:${theme.name}`, () =>
    execa(
      'tsc',
      [
        '-p',
        theme.tsConfigPath ? theme.tsConfigPath : 'tsconfig.json',
        '--outDir',
        theme.outputPath,
        '--tsBuildInfoFile',
        `./lib/${theme.name}.tsbuildinfo`,
        '--declarationMap',
        '--sourceMap',
        '--inlineSources',
        '--sourceRoot',
        `lib/${theme.name}`,
      ],
      {
        stdio: 'inherit',
      }
    )
  );
}

module.exports = parallel(themes.map(theme => compileTypescript(theme)));
module.exports.compileTypescript = compileTypescript;
