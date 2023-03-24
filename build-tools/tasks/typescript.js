// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { parallel } = require('gulp');
const execa = require('execa');
const themes = require('../utils/themes');
const { task } = require('../utils/gulp-utils');
const { isProd } = require('../utils/workspace');

function compileTypescript(theme) {
  return task(`typescript:${theme.name}`, () => {
    // Don't generate source maps for prod builds because source map's `source` path is not accurate anymore on custom themed builds.
    const additionalOptions = [];
    if (!isProd) {
      additionalOptions.push('--declarationMap', '--sourceMap', '--inlineSources');
    }

    return execa(
      'tsc',
      [
        '-p',
        theme.tsConfigPath ? theme.tsConfigPath : 'tsconfig.json',
        '--outDir',
        theme.outputPath,
        '--tsBuildInfoFile',
        `./lib/${theme.name}.tsbuildinfo`,
        ...additionalOptions,
      ],
      {
        stdio: 'inherit',
      }
    );
  });
}

module.exports = parallel(themes.map(theme => compileTypescript(theme)));
module.exports.compileTypescript = compileTypescript;
