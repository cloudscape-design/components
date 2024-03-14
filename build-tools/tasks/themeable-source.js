// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { parallel } = require('gulp');
const path = require('path');
const { promises: fsp, cpSync } = require('fs');
const fse = require('fs-extra');
const { join } = require('path');

const { task } = require('../utils/gulp-utils');
const workspace = require('../utils/workspace');
const themes = require('../utils/themes');
const { generatePackageJson } = require('./package-json');
const { copyThirdPartyLicenses } = require('./licenses');
const { compileTypescript } = require('./typescript');

const componentsTemplateDir = 'internal/template';
const designTokensTemplateDir = 'internal/template-tokens';
const stylesDir = 'internal/scss';

const theme = themes.find(theme => theme.name === 'default');
const themeable = {
  name: 'components-themeable',
  sourceDir: theme.outputPath,
  targetDir: join(workspace.targetPath, 'components-themeable'),
  packageJson: {
    name: '@cloudscape-design/components-themed',
  },
  tokensPackageJson: {
    name: '@cloudscape-design/design-tokens-themed',
  },
};

const copyStylesTask = task(`themeable-source:copy-styles:${themeable.name}`, async () => {
  const sourceDir = workspace.sourcePath;
  const targetDir = path.join(themeable.targetDir, stylesDir);

  await fse.ensureDir(targetDir);
  await fse.copy(sourceDir, targetDir, {
    filter: src => {
      // Include directories, SVGs in code-editor/assets/, and .scss files
      return (
        fse.lstatSync(src).isDirectory() ||
        (src.endsWith('.svg') && src.includes('code-editor/assets/')) ||
        src.endsWith('.scss')
      );
    },
  });
});

const copyTemplateTask = task(`themeable-source:copy-template:${themeable.name}`, async () => {
  const dest = path.join(themeable.targetDir, componentsTemplateDir);
  await fsp.mkdir(dest, { recursive: true });
  // The '.' tells cp to copy all files inside the source to the destination.
  // Using it as part of path.join will simply resolve it. That's why, we use template strings.
  return cpSync(`${path.join(themeable.sourceDir, '/')}.`, dest, { recursive: true });
});

module.exports = parallel(
  compileTypescript({
    name: themeable.name,
    tsConfigPath: 'tsconfig.src-themeable.json',
    outputPath: themeable.targetDir,
  }),
  generatePackageJson(join(themeable.targetDir, componentsTemplateDir), themeable.packageJson, {
    injectDependencies: true,
  }),
  generatePackageJson(join(themeable.targetDir, designTokensTemplateDir), themeable.tokensPackageJson),
  copyThirdPartyLicenses('themeable', join(themeable.targetDir, componentsTemplateDir)),
  copyStylesTask,
  copyTemplateTask
);
