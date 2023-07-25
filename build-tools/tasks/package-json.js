// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { parallel } = require('gulp');
const path = require('path');
const fs = require('fs');
const { writeFile, listPublicItems, listBetaVersions } = require('../utils/files');
const themes = require('../utils/themes');
const { task, copyTask } = require('../utils/gulp-utils');
const workspace = require('../utils/workspace');
const pkg = require('../../package.json');

function getComponentsExports() {
  const result = {
    '.': './index.js',
    // Node.js recommends including package.json in the exports
    // https://github.com/nodejs/node/issues/33460
    './package.json': './package.json',
    './theming': './theming/index.js',
    './test-utils/dom': './test-utils/dom/index.js',
    './test-utils/selectors': './test-utils/selectors/index.js',
    // TypeScript interfaces, can be imported separately from components
    './interfaces': './interfaces.js',
    './contexts/form-field': './contexts/form-field.js',
  };
  let components = listPublicItems('src');

  // Also target nested beta versions of components by naming convention.
  for (const component of components) {
    const betaVersions = listBetaVersions(path.join('src', component));
    if (betaVersions.length > 0) {
      const betaComponents = betaVersions.map(subComponent => `${component}/${subComponent}`);
      components = components.concat(betaComponents);
    }
  }

  for (const component of components) {
    result[`./${component}`] = `./${component}/index.js`;
  }

  // Internationalization and messages
  result['./i18n'] = './i18n/index.js';
  result[`./i18n/messages`] = `./i18n/messages/index.js`;
  for (const translationFile of fs.readdirSync('src/i18n/messages')) {
    const [subset, locale] = translationFile.split('.');
    if (subset && locale) {
      result[`./i18n/messages/${subset}.${locale}`] = `./i18n/messages/${subset}.${locale}.js`;
      result[`./i18n/messages/${subset}.${locale}.json`] = `./i18n/messages/${subset}.${locale}.json`;
    }
  }

  return result;
}

function getSideEffects() {
  return [
    '*.css',
    // this file exposes `awsuiVersions` object
    './internal/base-component/index.js',
    // this file contains css-variables overrides for dark and other modes
    './internal/base-component/styles.css.js',
  ];
}

function generatePackageJson(target, baseContent, { injectDependencies } = {}) {
  return task(`package-json:${baseContent.name}`, () => {
    const content = { ...baseContent, version: pkg.version, repository: pkg.repository, homepage: pkg.homepage };
    if (injectDependencies) {
      content.dependencies = pkg.dependencies;
      content.peerDependencies = pkg.peerDependencies;
    }

    writeFile(path.join(target, 'package.json'), JSON.stringify(content, null, 2));
    return Promise.resolve();
  });
}

const styleDictionaryPackageJson = generatePackageJson(path.join(workspace.targetPath, 'style-dictionary'), {
  name: '@cloudscape-design/style-dictionary',
  dependencies: { lodash: '^4.0.0' },
});

const componentsThemeablePackageJson = generatePackageJson(path.join(workspace.targetPath, 'components-themeable'), {
  name: '@cloudscape-design/components-themeable',
});

const devPagesPackageJson = generatePackageJson(path.join(workspace.targetPath, 'dev-pages'), {
  name: '@cloudscape-design/dev-pages',
});

module.exports = parallel([
  ...themes.flatMap(theme => [
    generatePackageJson(
      theme.outputPath,
      {
        ...theme.packageJson,
        files: ['*'],
        main: './index.js',
        exports: getComponentsExports(),
        sideEffects: getSideEffects(),
      },
      { injectDependencies: true }
    ),
    generatePackageJson(path.join(workspace.targetPath, theme.designTokensDir), theme.designTokensPackageJson),
  ]),
  generatePackageJson(path.join(workspace.targetPath, 'components-definitions'), {
    name: '@cloudscape-design/components-definitions',
  }),
  styleDictionaryPackageJson,
  componentsThemeablePackageJson,
  copyTask('package-lock', ['package-lock.json'], path.join(workspace.targetPath, 'dev-pages', 'internal')),
  devPagesPackageJson,
]);
module.exports.generatePackageJson = generatePackageJson;
