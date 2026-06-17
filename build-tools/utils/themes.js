// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const workspace = require('./workspace');

// Registry of secondary themes that can be layered on top of the primary theme as opt-in overrides.
// To add a new theme, register its id and style-dictionary entry path here, then include it via the
// THEMES env var.
const SECONDARY_THEMES = {
  'visual-refresh': './visual-refresh-secondary/index.js',
  'one-theme': './one-theme/index.js',
};

// THEMES is a comma-separated list of secondary themes to compile into the build, e.g.
// `THEMES=visual-refresh,one-theme`. Defaults to `visual-refresh`.
const includedThemes = (process.env.THEMES ?? 'visual-refresh')
  .split(',')
  .map(name => name.trim())
  .filter(Boolean);

includedThemes.forEach(name => {
  if (!SECONDARY_THEMES[name]) {
    throw new Error(
      `Unknown theme "${name}" in THEMES env var. Available themes: ${Object.keys(SECONDARY_THEMES).join(', ')}.`
    );
  }
});

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
    includedThemes,
    secondaryThemePaths: includedThemes.map(name => SECONDARY_THEMES[name]),
  },
];

module.exports = themes;
