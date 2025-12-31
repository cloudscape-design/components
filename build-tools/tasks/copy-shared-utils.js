// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { cpSync } = require('node:fs');
const path = require('path');
const { mkdirSync, existsSync } = require('fs');

module.exports = function copySharedUtils() {
  const targetPath = path.join('lib', 'dev-pages', 'pages', 'shared-utils');

  if (!existsSync(targetPath)) {
    mkdirSync(targetPath, { recursive: true });
  }

  cpSync('node_modules/@cloudscape-design/build-tools/src/test-pages-util', targetPath, { recursive: true });
  return Promise.resolve();
};
