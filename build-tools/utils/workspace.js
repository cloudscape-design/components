// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { version } = require('../../package.json');
const gitCommitVersion = (process.env.GITHUB_SHA || 'HEAD').slice(0, 8);
const packageVersion = `${version} (${gitCommitVersion})`;

const targetPath = 'lib';

module.exports = {
  isProd: process.env.NODE_ENV === 'production',
  packageVersion,
  sourcePath: 'src',
  generatedPath: 'src/internal/generated',
  generatedTestUtils: 'src/test-utils/selectors',
  staticSitePath: 'build/static',
  npmModulesTarget: 'build/aws-ui-npm',
  compiledStyleDictionary: 'lib/style-dictionary',
  apiDocsPath: 'lib/components-definitions',
  targetPath,
};
