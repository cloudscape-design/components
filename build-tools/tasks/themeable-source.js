// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { parallel } = require('gulp');
const path = require('path');
const { promises: fsp } = require('fs');
const { join } = require('path');
const { task, noop } = require('../utils/gulp-utils');
const workspace = require('../utils/workspace');
const themes = require('../utils/themes');
const { generatePackageJson } = require('./package-json');
const { copyThirdPartyLicenses } = require('./licenses');
const execa = require('execa');

const templateDir = 'internal/template';
const stylesDir = 'internal/scss';

const theme = themes.find(theme => theme.name === 'default');
const themeables = [];

if (theme) {
  themeables.push({
    name: 'components-themeable',
    sourceDir: theme.outputPath,
    targetDir: join(workspace.targetPath, 'components-themeable'),
    packageJson: {
      name: '@cloudscape-design/components-themed',
    },
  });
}

const createCopyStylesTask = themeable => {
  return task(`themeable-source:copy-styles:${themeable.name}`, () => {
    return execa('rsync', [
      '--prune-empty-dirs',
      '-a',
      '--include',
      '*/',
      // Code Editor SVGs will be embedded into the styling
      '--include',
      'code-editor/assets/*.svg',
      '--include',
      '*.scss',
      '--exclude',
      '*',
      `${workspace.sourcePath}/`,
      `${path.join(themeable.targetDir, stylesDir)}/`,
    ]);
  });
};

const createCopyTemplateTask = themeable => {
  return task(`themeable-source:copy-template:${themeable.name}`, async () => {
    const dest = path.join(themeable.targetDir, templateDir);
    await fsp.mkdir(dest, { recursive: true });
    // The '.' tells cp to copy all files inside the source to the destination.
    // Using it as part of path.join will simply resolve it. That's why, we use template strings.
    return execa('cp', ['-R', `${path.join(themeable.sourceDir, '/')}.`, dest]);
  });
};

const createGenerateExtrasTask = themeable => {
  return parallel(
    generatePackageJson(join(themeable.targetDir, templateDir), themeable.packageJson, {
      injectDependencies: true,
    }),
    copyThirdPartyLicenses('themeable', join(themeable.targetDir, templateDir))
  );
};

const parallelOrNOOP = tasks => (tasks.length ? parallel(...tasks) : noop);

const copyStylesTask = parallelOrNOOP(themeables.map(themeable => createCopyStylesTask(themeable)));
const copyTemplateTask = parallelOrNOOP(themeables.map(themeable => createCopyTemplateTask(themeable)));
const generateExtraTask = parallelOrNOOP(themeables.map(themeable => createGenerateExtrasTask(themeable)));

module.exports = parallel(copyStylesTask, copyTemplateTask, generateExtraTask);
