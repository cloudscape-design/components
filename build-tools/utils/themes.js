// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const workspace = require('./workspace');

const THEME = process.env.THEME || 'default';

const allThemes = [
  {
    name: 'default',
    packageJson: { name: '@cloudscape-design/components' },
    designTokensOutput: 'index',
    designTokensDir: 'design-tokens',
    designTokensPackageJson: { name: '@cloudscape-design/design-tokens' },
    outputPath: path.join(workspace.targetPath, 'components'),
    primaryThemePath: './core-open-source/index.js',
    secondaryThemePaths: [],
    metadataPath: './visual-refresh/metadata.js',
    alwaysVisualRefresh: true,
  },
  {
    name: 'visual-refresh',
    packageJson: { name: '@cloudscape-design/components' },
    designTokensOutput: 'index',
    designTokensDir: 'design-tokens',
    designTokensPackageJson: { name: '@cloudscape-design/design-tokens' },
    outputPath: path.join(workspace.targetPath, 'components'),
    primaryThemePath: './visual-refresh/index.js',
    secondaryThemePaths: [],
    metadataPath: './visual-refresh/metadata.js',
    alwaysVisualRefresh: true,
  },
  {
    name: 'classic',
    packageJson: { name: '@cloudscape-design/components' },
    designTokensOutput: 'index',
    designTokensDir: 'design-tokens',
    designTokensPackageJson: { name: '@cloudscape-design/design-tokens' },
    outputPath: path.join(workspace.targetPath, 'components'),
    primaryThemePath: './classic/index.js',
    secondaryThemePaths: [],
    metadataPath: './classic/metadata.js',
    alwaysVisualRefresh: false,
  },
  {
    name: 'one-theme',
    packageJson: { name: '@cloudscape-design/components' },
    designTokensOutput: 'index',
    designTokensDir: 'design-tokens',
    designTokensPackageJson: { name: '@cloudscape-design/design-tokens' },
    outputPath: path.join(workspace.targetPath, 'components'),
    primaryThemePath: './one-theme/index.js',
    secondaryThemePaths: [],
    metadataPath: './visual-refresh/metadata.js',
    alwaysVisualRefresh: true,
  },
];

// Build only the selected theme (default: 'default' which is core-open-source)
const themes = allThemes.filter(t => t.name === THEME);

if (themes.length === 0) {
  const available = allThemes.map(t => t.name).join(', ');
  throw new Error(`Unknown theme "${THEME}". Available themes: ${available}`);
}

module.exports = themes;
