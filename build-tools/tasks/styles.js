// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { parallel, series } = require('gulp');
const { readFileSync, writeFileSync } = require('fs');
const { createHash } = require('crypto');
const { join } = require('path');
const { buildThemedComponentsInternal } = require('@cloudscape-design/theming-build/internal');

const themes = require('../utils/themes');
const workspace = require('../utils/workspace');
const { task } = require('../utils/gulp-utils');
const { writeFile } = require('../utils/files');
const { getTokenVersions } = require('../utils/token-versions');
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

    await buildThemedComponentsInternal({
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

    // Post-process: inject .awsui-auto-mode CSS alongside .awsui-dark-mode.
    // The auto-mode class wraps the same dark-mode token overrides inside
    // @media (prefers-color-scheme: dark) so SSR apps can avoid theme flash
    // without JavaScript by rendering the class server-side.
    injectAutoModeStyles(theme.outputPath);
  });
}

/**
 * Reads the compiled base-component styles.scoped.css, extracts all
 * `.awsui-dark-mode` rules that live inside `@media not print { … }` blocks,
 * replaces the selector with `.awsui-auto-mode`, wraps the block in the
 * combined media query `@media not print and (prefers-color-scheme: dark)`,
 * and appends the result to the same file.
 *
 * This is a text-level transformation — it does not parse the CSS AST — so it
 * relies on the stable output format produced by theming-build's PostCSS pipeline.
 */
function injectAutoModeStyles(outputPath) {
  const stylesPath = join(outputPath, 'internal/base-component/styles.scoped.css');
  let css;
  try {
    css = readFileSync(stylesPath, 'utf-8');
  } catch {
    // File may not exist in some build configurations; skip silently.
    return;
  }

  // Extract the @media not print { … } block that contains the dark-mode overrides.
  // The block starts with `@media not print {` and contains nested .awsui-dark-mode rules.
  // We capture the entire @media block using a bracket-depth counter.
  const darkModeMediaBlocks = [];
  const mediaStart = '@media not print {';
  let searchFrom = 0;

  while (true) {
    const blockStart = css.indexOf(mediaStart, searchFrom);
    if (blockStart === -1) {
      break;
    }

    // Walk forward counting braces to find the matching closing `}`.
    let depth = 0;
    let blockEnd = -1;
    for (let i = blockStart; i < css.length; i++) {
      if (css[i] === '{') {
        depth++;
      } else if (css[i] === '}') {
        depth--;
        if (depth === 0) {
          blockEnd = i;
          break;
        }
      }
    }

    if (blockEnd === -1) {
      break;
    }

    const block = css.slice(blockStart, blockEnd + 1);

    // Only keep blocks that contain `.awsui-dark-mode` selectors.
    if (block.includes('.awsui-dark-mode')) {
      darkModeMediaBlocks.push(block);
    }

    searchFrom = blockEnd + 1;
  }

  if (darkModeMediaBlocks.length === 0) {
    return;
  }

  // Build the auto-mode equivalent: replace selector, wrap in combined media query.
  const autoModeBlocks = darkModeMediaBlocks.map(block => {
    // Replace all occurrences of .awsui-dark-mode with .awsui-auto-mode.
    // Also handle the compound selector `.awsui-context-X.awsui-dark-mode`.
    const autoBlock = block
      .replace(/\.awsui-dark-mode/g, '.awsui-auto-mode')
      // The inner @media is `not print`; replace with the combined query.
      .replace('@media not print {', '@media not print and (prefers-color-scheme: dark) {');
    return autoBlock;
  });

  const autoModeSection = [
    '',
    '/*',
    ' * .awsui-auto-mode — CSS-only system-preference dark mode (auto-generated).',
    ' * Apply this class to the root element to activate dark-mode tokens when the',
    ' * OS/browser prefers dark (`prefers-color-scheme: dark`), without JavaScript.',
    ' * See: https://github.com/cloudscape-design/components/issues/4128',
    ' */',
    ...autoModeBlocks,
    '',
  ].join('\n');

  writeFileSync(stylesPath, css + autoModeSection, 'utf-8');
}

module.exports = series(
  generateEnvironment(),
  compileStyleDictionary(),
  parallel(themes.map(theme => stylesTask(theme)))
);
