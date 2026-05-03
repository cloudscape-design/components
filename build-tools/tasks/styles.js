// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { parallel, series } = require('gulp');
const { readFileSync, existsSync } = require('fs');
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

/**
 * Extracts dark mode CSS rules from the generated styles and creates a separate
 * CSS file that applies dark mode styles based on prefers-color-scheme media query.
 *
 * This allows consumers to opt-in to automatic dark mode without bundling the
 * duplicate styles by default.
 */
function generateDarkModePrefersCss(theme) {
  return task(`dark-mode-prefers:${theme.name}`, () => {
    const baseStylesPath = join(theme.outputPath, 'internal/base-component/styles.scoped.css');

    if (!existsSync(baseStylesPath)) {
      console.log(`  Base component styles not found at ${baseStylesPath}, skipping dark-mode-prefers CSS`);
      return Promise.resolve();
    }

    const cssContent = readFileSync(baseStylesPath, 'utf-8');
    const darkModeRules = extractDarkModeRules(cssContent);

    if (darkModeRules.length === 0) {
      console.log('  No dark mode rules found, skipping dark-mode-prefers CSS');
      return Promise.resolve();
    }

    // Transform .awsui-dark-mode to .awsui-dark-mode-if-preferred
    const transformedRules = darkModeRules.map(rule =>
      rule.replace(/\.awsui-dark-mode/g, '.awsui-dark-mode-if-preferred')
    );

    const outputCss = `/* Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved. */
/* SPDX-License-Identifier: Apache-2.0 */

/*
 * This file provides automatic dark mode support based on the user's system preference.
 * Import this file and apply the .awsui-dark-mode-if-preferred class to enable automatic
 * dark mode switching based on prefers-color-scheme.
 *
 * Usage:
 *   import darkModeStyles from '@cloudscape-design/design-tokens/dark-mode-prefers.css';
 *   <div className={darkModeStyles.awsuiDarkModeIfPreferred}>...</div>
 *
 * Or without CSS modules:
 *   import '@cloudscape-design/design-tokens/dark-mode-prefers.css';
 *   <div className="awsui-dark-mode-if-preferred">...</div>
 */

@media (prefers-color-scheme: dark) {
${transformedRules.join('\n\n')}
}
`;

    const designTokensOutputDir = join(workspace.targetPath, theme.designTokensDir);
    writeFile(join(designTokensOutputDir, 'dark-mode-prefers.css'), outputCss);
    console.log(`  Generated dark-mode-prefers.css (${transformedRules.length} rules)`);

    return Promise.resolve();
  });
}

/**
 * Extracts all .awsui-dark-mode CSS rule blocks from the stylesheet content.
 */
function extractDarkModeRules(cssContent) {
  const lines = cssContent.split('\n');
  const darkModeRules = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Look for dark mode selectors (not inside @media blocks)
    if (line.includes('.awsui-dark-mode') && line.includes('{') && !line.trim().startsWith('@media')) {
      // Extract the full rule block
      let braceCount = 0;
      const ruleLines = [];
      let j = i;

      while (j < lines.length) {
        const currentLine = lines[j];
        ruleLines.push(currentLine);

        for (const char of currentLine) {
          if (char === '{') {
            braceCount++;
          }
          if (char === '}') {
            braceCount--;
          }
        }

        if (braceCount === 0 && ruleLines.length > 0) {
          break;
        }
        j++;
      }

      darkModeRules.push(ruleLines.join('\n'));
      i = j + 1;
    } else {
      i++;
    }
  }

  return darkModeRules;
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
  parallel(themes.map(theme => series(stylesTask(theme), generateDarkModePrefersCss(theme))))
);
