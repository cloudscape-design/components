// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const { writeComponentsDocumentation, writeTestUtilsDocumentation } = require('@cloudscape-design/documenter');
const workspace = require('../utils/workspace');

module.exports = function docs() {
  writeComponentsDocumentation({
    outDir: path.join(workspace.apiDocsPath, 'components'),
    tsconfigPath: require.resolve('../../tsconfig.json'),
    // VirtualTable (design-study cell F1-A2) is a compound-component namespace exported as an
    // object literal ({ Root, Header, Body, Row, Cell, ExpandedContent }). The API documenter
    // only supports a single-function default export per index.tsx, so it is excluded here
    // pending documenter support for compound components (tracked as a PR follow-up). Its API
    // is described in src/virtual-table/USAGE.md instead.
    publicFilesGlob: 'src/!(virtual-table)/index.tsx',
    extraExports: {
      FileDropzone: ['useFilesDragging'],
      IconProvider: ['defineIcons', 'IconRegistry', 'IconMap'],
      TagEditor: ['getTagsDiff'],
    },
  });
  writeTestUtilsDocumentation({
    outDir: path.join(workspace.apiDocsPath, 'test-utils-doc'),
    tsconfigPath: require.resolve('../../src/test-utils/tsconfig.json'),
    includeCoreMethods: false,
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
