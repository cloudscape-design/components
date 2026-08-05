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
  // TODO(beta): document the beta BasicTable components. The per-component dirs + this glob are ready
  // (glob matches exactly the 7 component dirs), but the documenter cannot serialize the parts' props
  // while they `extends React.*HTMLAttributes` (fails on ReactEventHandler<T>). Re-enable once the part
  // interfaces are minimized to explicit, consumer-facing props.
  // writeComponentsDocumentation({
  //   outDir: path.join(workspace.apiDocsPath, 'components'),
  //   tsconfigPath: require.resolve('../../tsconfig.json'),
  //   publicFilesGlob: 'src/beta/*/*/index.tsx',
  // });
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
