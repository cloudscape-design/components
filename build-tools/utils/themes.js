// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const workspace = require('./workspace');

const themes = [
  // This is the default Cloudscape theme, which is best used with Visual Refresh enabled (by default)
  {
    name: 'default',
    packageJson: { name: '@cloudscape-design/components' },
    designTokensOutput: 'index',
    designTokensDir: 'design-tokens',
    designTokensPackageJson: {
      name: '@cloudscape-design/design-tokens',
      exports: {
        '.': './index.js',
        './index.js': './index.js',
        './index.scss': './index.scss',
        './dark-mode-prefers.css': './dark-mode-prefers.css',
      },
    },
    outputPath: path.join(workspace.targetPath, 'components'),
    primaryThemePath: './classic/index.js',
    secondaryThemePaths: ['./visual-refresh-secondary/index.js'],
  },
];

module.exports = themes;
