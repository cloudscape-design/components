// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable no-unsanitized/method */

const { parallel, series } = require('gulp');
const { promises: fs } = require('fs');
const { dirname, join } = require('path');
const { generateThemeStylesheet } = require('@cloudscape-design/theming-build');
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

/**
 * Pregenerates a stylesheet for the core-update theme, consumed by the dev pages (see pages/app/index.tsx).
 *
 * The stylesheet is generated at build time (instead of calling the runtime theming API in the
 * browser) because the dev pages' CSP (style-src 'self') blocks runtime-injected style nodes.
 * It is scoped under the .awsui-core-update selector, so the dev pages can always bundle it and
 * activate it by toggling the class on the body element.
 */
function coreNewPagesThemeTask() {
  const outputPath = join(__dirname, '../../pages/app/generated/core-update-theme.css');
  return task('styles:core-update-pages-theme', async () => {
    const { default: theme } = await import(join(styleDictionaryRoot, 'core-update/index.js'));

    // Only themeable tokens can be part of a theme override. The rest would be
    // dropped by generateThemeStylesheet with a console warning for each token.
    const { default: metadata } = await import(join(styleDictionaryRoot, 'core-update/metadata.js'));
    const filterThemeable = tokens =>
      Object.fromEntries(Object.entries(tokens).filter(([token]) => metadata[token]?.themeable));

    const override = {
      tokens: filterThemeable(theme.tokens),
      contexts: Object.fromEntries(
        Object.entries(theme.contexts).map(([contextId, context]) => [
          contextId,
          { tokens: filterThemeable(context.tokens) },
        ])
      ),
      ...(theme.referenceTokens ? { referenceTokens: theme.referenceTokens } : {}),
    };

    const { preset } = require(
      join(__dirname, '../../', workspace.targetPath, 'components/internal/generated/theming/index.cjs')
    );

    const stylesheet = generateThemeStylesheet({
      override,
      preset,
      baseThemeId: 'visual-refresh',
      // Not a special value, this selector is only used for the dev pages.
      selector: '.awsui-core-update',
    });

    await fs.mkdir(dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, stylesheet + '\n');
  });
}

module.exports = series(
  compileStyleDictionary(),
  parallel(themes.map(theme => stylesTask(theme))),
  coreNewPagesThemeTask()
);
