// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const path = require('path');
const baseConfig = require('./webpack.config.base.cjs');
const themes = require('../build-tools/utils/themes');
const workspace = require('../build-tools/utils/workspace');

module.exports = () => {
  const react18 = process.env.REACT_VERSION === '18';
  const themeDefinition = themes[0];
  return baseConfig({
    componentsPath: path.resolve(themeDefinition.outputPath),
    designTokensPath: path.resolve(
      workspace.targetPath,
      themeDefinition.designTokensDir,
      themeDefinition.designTokensOutput
    ),
    globalStylesPath: themeDefinition.globalStylesPath,
    outputPath: `pages/lib/static-${themeDefinition.name}`,
    react18,
  });
};
