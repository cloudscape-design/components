// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { parallel } = require('gulp');
const themes = require('../utils/themes');
const { copyTask } = require('../utils/gulp-utils');

const copyFiles = (name, destination) => {
  return copyTask(`license:${name}`, ['THIRD-PARTY-LICENSES', 'LICENSE', 'NOTICE', 'README.md'], destination);
};

module.exports = parallel(themes.map(theme => copyFiles(theme.name, theme.outputPath)));
module.exports.copyFiles = copyFiles;
