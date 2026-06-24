// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const workspace = require('./workspace');

// Secondary themes are layered on top of the primary theme as opt-in overrides. Each entry maps a
// theme id to its style-dictionary entry point. To add a new theme, register it here, then include
// it via the THEMES env var.
const SECONDARY_THEME_PATHS = {
  'visual-refresh': './visual-refresh-secondary/index.js',
  'one-theme': './one-theme/index.js',
};

// Secondary themes included when THEMES is not set. Keeps visual refresh in, one-theme opt-in.
const DEFAULT_THEMES = 'visual-refresh';

// Resolves which secondary themes to compile from the comma-separated THEMES env var, e.g.
// `THEMES=visual-refresh,one-theme`. Throws if a requested theme is not registered above.
function resolveIncludedThemes() {
  const themeIds = (process.env.THEMES ?? DEFAULT_THEMES)
    .split(',')
    .map(id => id.trim())
    .filter(Boolean);

  for (const id of themeIds) {
    if (!SECONDARY_THEME_PATHS[id]) {
      const availableThemes = Object.keys(SECONDARY_THEME_PATHS).join(', ');
      throw new Error(`Unknown theme "${id}" in THEMES env var. Available themes: ${availableThemes}.`);
    }
  }

  return themeIds;
}

const includedThemes = resolveIncludedThemes();

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
    secondaryThemePaths: includedThemes.map(id => SECONDARY_THEME_PATHS[id]),
  },
];

module.exports = themes;
