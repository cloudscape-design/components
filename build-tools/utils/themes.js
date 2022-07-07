// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const workspace = require('./workspace');
const currentTheme = process.env.THEME;

const themes = [
  // This is the default Cloudscape theme, which is best used with Visual Refresh enabled (by default)
  {
    name: 'default',
    packageJson: { name: '@cloudscape-design/components' },
    designTokensOutput: 'index',
    designTokensDir: 'design-tokens',
    designTokensPackageJson: { name: '@cloudscape-design/design-tokens' },
    outputPath: path.join(workspace.targetPath, 'components'),
    primaryThemePath: './classic',
    secondaryThemePaths: ['./visual-refresh-secondary'],
  },

  // This is the deprecated classic theme, which is not visually refreshed.
  // If you want to use this theme, uncomment the following block.
  // Make sure to also manually install the classic global styles (@awsui/global-styles).
  /*
  {
    name: 'classic',
    packageJson: { name: '@cloudscape-design/components-classic' },
    designTokensOutput: 'index',
    designTokensDir: 'design-tokens-classic',
    designTokensPackageJson: { name: '@cloudscape-design/design-tokens-classic' },
    globalStylesPath: path.dirname(require.resolve('@awsui/global-styles/index.css')),
    outputPath: path.join(workspace.targetPath, 'components-classic'),
    primaryThemePath: './classic',
  },
  */
].filter(theme => !currentTheme || theme.name === currentTheme);

module.exports = themes;
