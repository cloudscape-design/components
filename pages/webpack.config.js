// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const baseConfig = require('./webpack.config.base');
const themes = require('../build-tools/utils/themes');
const workspace = require('../build-tools/utils/workspace');

module.exports = () => {
  const theme = process.env.THEME || 'default';
  const themeDefinition = themes.find(t => t.name === theme);

  return baseConfig({
    componentsPath: path.resolve(themeDefinition.outputPath),
    designTokensPath: path.resolve(
      workspace.targetPath,
      themeDefinition.designTokensDir,
      themeDefinition.designTokensOutput
    ),
    globalStylesPath: themeDefinition.globalStylesPath,
    outputPath: `lib/static-${theme}`,
  });
};
