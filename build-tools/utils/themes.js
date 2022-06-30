// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const workspace = require('./workspace');
const currentTheme = process.env.THEME;

const themes = [
  // This is the default Cloudscape theme, which is always visually refreshed
  {
    name: 'default',
    packageJson: { name: '@cloudscape-design/components' },
    designTokensOutput: 'index',
    designTokensDir: 'design-tokens-cloudscape',
    designTokensPackageJson: { name: '@cloudscape-design/design-tokens' },
    outputPath: path.join(workspace.targetPath, 'components-cloudscape'),
    primaryThemePath: './visual-refresh',
    alwaysVisualRefresh: true,
  },

  // This theme combines classic and Visual Refresh for easy testing during development.
  // It is also used for integration tests.
  {
    name: 'dev',
    packageJson: { name: '@cloudscape-design/components' },
    designTokensOutput: 'index',
    designTokensDir: 'design-tokens',
    designTokensPackageJson: { name: '@cloudscape-design/design-tokens' },
    globalStylesPath: path.dirname(require.resolve('@awsui/global-styles/index.css')),
    outputPath: path.join(workspace.targetPath, 'components'),
    primaryThemePath: './classic',
    secondaryThemePaths: ['./visual-refresh-secondary'],
  },
].filter(theme => !currentTheme || theme.name === currentTheme);

module.exports = themes;
