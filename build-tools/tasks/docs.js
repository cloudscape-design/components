// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const { writeComponentsDocumentation, writeTestUtilsDocumentation } = require('@cloudscape-design/documenter');
const workspace = require('../utils/workspace');

module.exports = function docs() {
  writeComponentsDocumentation({
    outDir: path.join(workspace.apiDocsPath, 'components'),
    tsconfigPath: require.resolve('../../tsconfig.json'),
    publicFilesGlob: 'src/*/index.tsx',
    extraExports: {
      FileDropzone: ['useFilesDragging'],
      TagEditor: ['getTagsDiff'],
    },
  });
  writeTestUtilsDocumentation({
    outDir: path.join(workspace.apiDocsPath, 'test-utils-doc'),
    tsconfigPath: require.resolve('../../src/test-utils/tsconfig.json'),
    domUtils: {
      root: 'src/test-utils/dom/index.ts',
      extraExports: ['default', 'ElementWrapper'],
    },
    selectorsUtils: {
      root: 'src/test-utils/selectors/index.ts',
      extraExports: ['default', 'ElementWrapper'],
    },
  });
  return Promise.resolve();
};
