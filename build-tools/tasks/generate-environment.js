// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const { writeFile } = require('../utils/files');
const themes = require('../utils/themes');
const workspace = require('../utils/workspace');

function writeEnvironmentFile(theme) {
  const filepath = 'internal/environment';
  const values = {
    PACKAGE_SOURCE: workspace.packageSource,
    PACKAGE_VERSION: workspace.packageVersion,
    THEME: theme.name,
    ALWAYS_VISUAL_REFRESH: !!theme.alwaysVisualRefresh,
  };
  const basePath = path.join(theme.outputPath, filepath);

  writeFile(`${basePath}.json`, JSON.stringify(values, null, 2));
  writeFile(
    `${basePath}.js`,
    Object.entries(values)
      .map(([key, value]) => `export var ${key} = ${JSON.stringify(value)};`)
      .join('\n')
  );
  writeFile(
    `${basePath}.d.ts`,
    Object.keys(values)
      .map(key => `export const ${key}: string;`)
      .join('\n')
  );
}

module.exports = function generateEnvironment() {
  themes.forEach(theme => writeEnvironmentFile(theme));

  return Promise.resolve();
};
