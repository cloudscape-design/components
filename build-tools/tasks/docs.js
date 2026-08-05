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
      IconProvider: ['defineIcons', 'IconRegistry', 'IconMap'],
      TagEditor: ['getTagsDiff'],
    },
  });
  // Beta components live under versioned dirs (src/beta/<name>-<major.minor>/). Document each part
  // dir's default export as its own component into a SEPARATE definitions folder: each
  // writeComponentsDocumentation call rewrites the index barrel from its own glob, so sharing the
  // stable `components` outDir would clobber the stable index. The glob matches exactly the
  // per-component dirs. The website opts into these beta definitions via this separate folder.
  writeComponentsDocumentation({
    outDir: path.join(workspace.apiDocsPath, 'components-beta'),
    tsconfigPath: require.resolve('../../tsconfig.json'),
    publicFilesGlob: 'src/beta/*/*/index.tsx',
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
