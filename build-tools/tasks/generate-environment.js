// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// Generates the `internal/environment` files for each theme.
// For every theme we write the same set of values in three forms:
//   - environment.json  raw values
//   - environment.js    runtime module, e.g. `export var THEME = "default";`
//   - environment.d.ts  type declarations, e.g. `export const THEME: string;`

const path = require('path');
const { writeFile } = require('../utils/files');
const themes = require('../utils/themes');
const workspace = require('../utils/workspace');

const ALWAYS_VISUAL_REFRESH = process.env.ALWAYS_VISUAL_REFRESH === 'true';

// The build-time constants exposed to the component source for a given theme.
function getEnvironmentValues(theme) {
  return {
    PACKAGE_SOURCE: workspace.packageSource,
    PACKAGE_VERSION: workspace.packageVersion,
    GIT_SHA: workspace.gitCommitVersion,
    THEME: theme.name,
    SYSTEM: 'core',
    ALWAYS_VISUAL_REFRESH: !!theme.alwaysVisualRefresh || ALWAYS_VISUAL_REFRESH,
    INCLUDED_THEMES: theme.includedThemes ?? [],
  };
}

function toTypeScriptType(value) {
  if (Array.isArray(value)) {
    return 'string[]';
  }
  if (typeof value === 'boolean') {
    return 'boolean';
  }
  return 'string';
}

// Source for environment.js, e.g. `export var THEME = "default";`
function toModuleSource(values) {
  return Object.entries(values)
    .map(([name, value]) => `export var ${name} = ${JSON.stringify(value)};`)
    .join('\n');
}

// Source for environment.d.ts, e.g. `export const THEME: string;`
function toDeclarationsSource(values) {
  return Object.entries(values)
    .map(([name, value]) => `export const ${name}: ${toTypeScriptType(value)};`)
    .join('\n');
}

function writeEnvironmentFile(theme) {
  const values = getEnvironmentValues(theme);
  const basePath = path.join(theme.outputPath, 'internal/environment');

  console.log('Environment values\n', JSON.stringify(values, null, 2));

  writeFile(`${basePath}.json`, JSON.stringify(values, null, 2));
  writeFile(`${basePath}.js`, toModuleSource(values));
  writeFile(`${basePath}.d.ts`, toDeclarationsSource(values));
}

module.exports = function generateEnvironment() {
  themes.forEach(writeEnvironmentFile);

  return Promise.resolve();
};
