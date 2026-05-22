// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const workspace = require('./workspace');

const INCLUDE_ONE_THEME = process.env.INCLUDE_ONE_THEME === 'true';

const themes = [
  // This is the default Cloudscape theme, which is best used with Visual Refresh enabled (by default)
  {
    name: 'default',
    packageJson: { name: '@cloudscape-design/components' },
    designTokensOutput: 'index',
    designTokensDir: 'design-tokens',
    designTokensPackageJson: { name: '@cloudscape-design/design-tokens' },
    outputPath: path.join(workspace.targetPath, 'components'),
    primaryThemePath: './classic/index.js',
    secondaryThemePaths: [
      './visual-refresh-secondary/index.js',
      ...(INCLUDE_ONE_THEME ? ['./one-theme/index.js'] : []),
    ],
  },
];

module.exports = themes;
