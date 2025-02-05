// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { parallel, series } = require('gulp');
const { readFileSync } = require('fs');
const { createHash } = require('crypto');
const { join } = require('path');
const { buildThemedComponentsInternal } = require('@cloudscape-design/theming-build/internal');

const themes = require('../utils/themes');
const workspace = require('../utils/workspace');
const { task } = require('../utils/gulp-utils');
const { writeFile } = require('../utils/files');
const { compileTypescript } = require('./typescript');

const styleDictionaryRoot = join(__dirname, '../../', workspace.compiledStyleDictionary);

function generateEnvironment() {
  return task(`style-dictionary:environment`, () => {
    const tokenStylesPath = join(workspace.sourcePath, './internal/styles/global.scss');
    const hash = createHash('sha256');
    hash.update(readFileSync(tokenStylesPath, 'utf-8'));
    const tokenStylesHash = hash.digest('hex').slice(0, 6);
    writeFile(
      join(styleDictionaryRoot, 'utils/environment.js'),
      `export const tokenStylesSuffix = "${tokenStylesHash}";`
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

function stylesTask(theme) {
  return task(`styles:${theme.name}`, async () => {
    const designTokensOutputDir = join(workspace.targetPath, theme.designTokensDir);
    // eslint-disable-next-line no-unsanitized/method
    const { default: primary } = await import(join(styleDictionaryRoot, theme.primaryThemePath));
    const secondary = await Promise.all(
      // eslint-disable-next-line no-unsanitized/method
      theme.secondaryThemePaths?.map(async path => (await import(join(styleDictionaryRoot, path))).default) ?? []
    );

    // eslint-disable-next-line no-unsanitized/method
    const { default: metadata } = await import(join(styleDictionaryRoot, theme.primaryThemePath, '../metadata.js'));
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
    });
  });
}

module.exports = series(
  generateEnvironment(),
  compileStyleDictionary(),
  parallel(themes.map(theme => stylesTask(theme)))
);
