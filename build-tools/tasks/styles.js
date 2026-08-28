// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-unsanitized/method */

const { parallel, series } = require('gulp');
const { join } = require('path');
const { buildThemedComponentsInternal } = require('@cloudscape-design/theming-build/internal');

const themes = require('../utils/themes');
const workspace = require('../utils/workspace');
const { task } = require('../utils/gulp-utils');
const { compileTypescript } = require('./typescript');

const styleDictionaryRoot = join(__dirname, '../../', workspace.compiledStyleDictionary);

function compileStyleDictionary() {
  return compileTypescript({
    name: 'style-dictionary',
    tsConfigPath: 'tsconfig.style-dictionary.json',
    outputPath: workspace.compiledStyleDictionary,
  });
}

function stylesTask(theme) {
  return task(`styles:${theme.name}`, async () => {
    const designTokensOutputDir = join(workspace.targetPath, theme.designTokensDir);
    const { default: primary } = await import(join(styleDictionaryRoot, theme.primaryThemePath));
    const secondary = await Promise.all(
      theme.secondaryThemePaths?.map(async path => (await import(join(styleDictionaryRoot, path))).default) ?? []
    );

    const { default: metadata } = await import(join(styleDictionaryRoot, theme.primaryThemePath, '../metadata.js'));
    const { getTokenVersions } = await import(join(styleDictionaryRoot, 'utils/token-versions.js'));
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
      designTokensOutputDir,
      designTokensFileName: theme.designTokensOutput,
      descriptions,
      jsonSchema: true,
      failOnDeprecations: true,
      tokenVersions: getTokenVersions(variablesMap),
    });
  });
}

module.exports = series(compileStyleDictionary(), parallel(themes.map(theme => stylesTask(theme))));
