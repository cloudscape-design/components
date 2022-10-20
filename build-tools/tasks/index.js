// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
module.exports = {
  clean: require('./clean'),
  docs: require('./docs'),
  generateEnvironment: require('./generate-environment'),
  generateIcons: require('./generate-icons'),
  generateIndexFile: require('./generate-index-file'),
  generateCustomCssPropertiesMap: require('./generate-custom-css-properties'),
  packageJSON: require('./package-json'),
  styles: require('./styles'),
  unit: require('./unit'),
  typescript: require('./typescript'),
  buildPages: require('./build-pages'),
  buildI18nInterfaces: require('./build-i18n-interfaces'),
  buildI18nMessages: require('./build-i18n-messages'),
  testUtils: require('./test-utils'),
  a11y: require('./a11y'),
  integ: require('./integ'),
  licenses: require('./licenses'),
  themeableSource: require('./themeable-source'),
};
