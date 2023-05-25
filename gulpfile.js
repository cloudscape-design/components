// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

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
  testUtils,
  a11y,
  generateI18nMessages,
  integ,
  licenses,
  themeableSource,
  bundleVendorFiles,
  buildTokensToolkit,
} = require('./build-tools/tasks');

const quickBuild = series(
  clean,
  parallel(packageJSON, generateI18nMessages, generateEnvironment, generateIcons, generateIndexFile, licenses),
  parallel(generateCustomCssPropertiesMap, styles, typescript, testUtils)
);

exports.clean = clean;
exports['quick-build'] = quickBuild;
exports.i18n = generateI18nMessages;
exports.build = series(quickBuild, bundleVendorFiles, parallel(buildPages, themeableSource, docs));
exports.test = series(unit, integ, a11y);
exports['test:unit'] = unit;
exports['test:integ'] = integ;
exports['test:a11y'] = a11y;

exports.watch = () => {
  watch(
    [
      'src/**/*.{ts,tsx}',
      '!src/test-utils/**/*.ts',
      '!**/__tests__/**',
      '!**/__integ__/**',
      '!**/__a11y__/**',
      '!src/internal/vendor/**/*.ts',
    ],
    typescript
  );
  watch(['src/internal/i18n/messages/*.json'], generateI18nMessages);
  watch(['src/test-utils/dom/**/*.ts', '!src/test-utils/dom/index.ts'], testUtils);
  watch(['style-dictionary/**/*.ts', 'src/**/*.scss'], styles);
};

exports['build-tokens-toolkit'] = buildTokensToolkit;
