// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { series, parallel } = require('gulp');
const execa = require('execa');
const path = require('path');
const { pascalCase } = require('change-case');
const { generateTestUtils } = require('@cloudscape-design/test-utils-converter');
const { task } = require('../utils/gulp-utils');
const { listPublicItems } = require('../utils/files');
const { pluralizeComponentName } = require('../utils/pluralize');
const themes = require('../utils/themes');

const testUtilsSrcDir = path.resolve('src/test-utils');

function compileTypescript(theme) {
  return task(`typescript:test-utils:${theme.name}`, async () => {
    const config = path.resolve(testUtilsSrcDir, 'tsconfig.json');
    const outDir = path.join(theme.outputPath, 'test-utils');
    await execa('tsc', ['-p', config, '--outDir', outDir, '--sourceMap'], { stdio: 'inherit' });
  });
}

function generateTestUtilsForComponents(signalCompletion) {
  const componentNamesKebabCase = listPublicItems(path.join(testUtilsSrcDir, 'dom'));

  const components = componentNamesKebabCase.map(testUtilsFolderName => {
    const name = pascalCase(testUtilsFolderName);
    const pluralName = pluralizeComponentName(name);
    return {
      name,
      pluralName,
      testUtilsFolderName,
    };
  });

  generateTestUtils({
    components,
    testUtilsPath: testUtilsSrcDir,
  });

  signalCompletion();
}

module.exports = series(generateTestUtilsForComponents, parallel(themes.map(theme => compileTypescript(theme))));
