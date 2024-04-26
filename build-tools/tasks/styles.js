// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { parallel, series } = require('gulp');
const { readFileSync } = require('fs');
const { createHash } = require('crypto');
const { join, basename } = require('path');
const { buildThemedComponentsInternal } = require('@cloudscape-design/theming-build/internal');

const themes = require('../utils/themes');
const workspace = require('../utils/workspace');
const { task } = require('../utils/gulp-utils');
const { writeFile } = require('../utils/files');
const { compileTypescript } = require('./typescript');

function generateEnvironment() {
  return task(`style-dictionary:environment`, () => {
    const tokenStylesPath = join(workspace.sourcePath, './internal/styles/global.scss');
    const hash = createHash('sha256');
    hash.update(readFileSync(tokenStylesPath, 'utf-8'));
    const tokenStylesHash = hash.digest('hex').slice(0, 6);
    writeFile(
      join(rootDir, workspace.compiledStyleDictionary, 'utils/environment.js'),
      `exports.tokenStylesSuffix = "${tokenStylesHash}";`
    );
    return Promise.resolve();
  });
}

function compileStyleDictionary() {
  return compileTypescript({
    name: 'style-dictionary',
    tsConfigPath: 'tsconfig.style-dictionary.json',
    outputPath: workspace.compiledStyleDictionary,
  });
}

const rootDir = join(__dirname, '../../');

function stylesTask(theme) {
  return task(`styles:${theme.name}`, () => {
    const designTokensOutputDir = join(workspace.targetPath, theme.designTokensDir);
    const primary = getTheme(theme.primaryThemePath);
    const secondary = theme.secondaryThemePaths ? theme.secondaryThemePaths.map(path => getTheme(path)) : [];
    const styleDictionaryName = basename(theme.primaryThemePath);

    const metadata = require(
      join(rootDir, `${workspace.compiledStyleDictionary}/${styleDictionaryName}/metadata`)
    ).default;
    const exposed = [];
    const themeable = [];
    const variablesMap = {};
    const descriptions = {};

    Object.entries(metadata).forEach(([token, meta]) => {
      if (meta.public) {
        exposed.push(token);
      }
      if (meta.themeable) {
        themeable.push(token);
      }
      if (meta.sassName) {
        variablesMap[token] = meta.sassName.substring(1);
      }
      if (meta.description) {
        descriptions[token] = meta.description;
      }
    });

    return buildThemedComponentsInternal({
      primary,
      secondary,
      exposed,
      themeable,
      variablesMap,
      scssDir: workspace.sourcePath,
      componentsOutputDir: theme.outputPath,
      skip: designTokensOutputDir ? [] : ['design-tokens'],
      designTokensOutputDir,
      designTokensFileName: theme.designTokensOutput,
      descriptions,
      jsonSchema: true,
    });
  });
}

function getTheme(themePath) {
  return require(join(rootDir, workspace.compiledStyleDictionary, themePath)).default;
}

module.exports = series(
  generateEnvironment(),
  compileStyleDictionary(),
  parallel(themes.map(theme => stylesTask(theme)))
);
