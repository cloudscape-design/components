// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { parallel, series } = require('gulp');
const { join, basename } = require('path');
const { buildThemedComponentsInternal } = require('@cloudscape-design/theming-build');

const themes = require('../utils/themes');
const workspace = require('../utils/workspace');
const { task } = require('../utils/gulp-utils');
const { compileTypescript } = require('./typescript');

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

    const metadata = require(join(
      rootDir,
      `${workspace.compiledStyleDictionary}/${styleDictionaryName}/metadata`
    )).default;
    const exposed = [];
    const themeable = [];
    const variablesMap = {};

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
    });
  });
}

function getTheme(themePath) {
  return require(join(rootDir, workspace.compiledStyleDictionary, themePath)).default;
}

module.exports = series(compileStyleDictionary(), parallel(themes.map(theme => stylesTask(theme))));
