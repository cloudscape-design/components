// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const { writeComponentsDocumentation, documentTestUtils } = require('@cloudscape-design/documenter');
const { writeFile } = require('../utils/files');
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
  testUtilDocs();
  return Promise.resolve();
};

function testUtilDocs() {
  ['dom', 'selectors'].forEach(testUtilType => {
    const baseWrapperDefinitions = require(`@cloudscape-design/test-utils-core/test-utils-doc/${testUtilType}`);
    const componentWrapperDefinitions = documentTestUtils(
      {
        tsconfig: require.resolve('../../src/test-utils/tsconfig.json'),
      },
      `**/{${testUtilType},types}/**/*`
    );

    const definitions = [...baseWrapperDefinitions, ...componentWrapperDefinitions];
    const indexContent = `module.exports = {
      classes: ${JSON.stringify(definitions)}
    }
    `;

    const outPath = path.join(workspace.apiDocsPath, 'test-utils-doc', `${testUtilType}.js`);
    writeFile(outPath, indexContent);
  });
}
