// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

// our package builds only on NodeJS 12 and above
require('please-upgrade-node')(require('./package.json'));

const { series, parallel, watch } = require('gulp');
const {
  clean,
  docs,
  generateEnvironment,
  generateIcons,
  generateIndexFile,
  generateCustomCssPropertiesMap,
  packageJSON,
  unit,
  styles,
  typescript,
  buildPages,
  buildI18n,
  testUtils,
  a11y,
  integ,
  licenses,
  themeableSource,
} = require('./build-tools/tasks');

const quickBuild = series(
  clean,
  parallel(packageJSON, generateEnvironment, generateIcons, generateIndexFile, licenses),
  parallel(generateCustomCssPropertiesMap, styles, typescript, testUtils)
);

exports.clean = clean;
exports['build-i18n'] = buildI18n;
exports['quick-build'] = quickBuild;
exports.build = series(quickBuild, parallel(buildPages, themeableSource, docs));
exports.test = series(unit, integ, a11y);
exports['test:unit'] = unit;
exports['test:integ'] = integ;
exports['test:a11y'] = a11y;

exports.watch = () => {
  watch(
    ['src/**/*.{ts,tsx}', '!src/test-utils/**/*.ts', '!**/__tests__/**', '!**/__integ__/**', '!**/__a11y__/**'],
    typescript
  );
  watch(['src/test-utils/dom/**/*.ts', '!src/test-utils/dom/index.ts'], testUtils);
  watch(['style-dictionary/**/*.ts', 'src/**/*.scss'], styles);
};
