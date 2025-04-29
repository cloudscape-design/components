// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const { documentComponents, documentTestUtils } = require('@cloudscape-design/documenter');
const { writeFile } = require('../utils/files');
const { listPublicItems } = require('../utils/files');
const workspace = require('../utils/workspace');

module.exports = function docs() {
  componentDocs();
  testUtilDocs();
  return Promise.resolve();
};

const publicDirs = listPublicItems('src');

function validatePublicFiles(definitionFiles) {
  for (const publicDir of publicDirs) {
    if (!definitionFiles.includes(publicDir)) {
      throw new Error(`Directory src/${publicDir} does not have a corresponding API definition`);
    }
  }
}

function componentDocs() {
  const definitions = documentComponents({
    tsconfigPath: require.resolve('../../tsconfig.json'),
    publicFilesGlob: 'src/*/index.tsx',
    extraExports: {
      FileDropzone: ['useFilesDragging'],
      TagEditor: ['getTagsDiff'],
    },
  });
  const outDir = path.join(workspace.apiDocsPath, 'components');
  for (const definition of definitions) {
    writeFile(
      path.join(outDir, definition.dashCaseName + '.js'),
      `module.exports = ${JSON.stringify(definition, null, 2)};`
    );
  }
  const indexContent = `module.exports = {
    ${definitions.map(definition => `${JSON.stringify(definition.dashCaseName)}:require('./${definition.dashCaseName}')`).join(',\n')}
  }`;
  writeFile(path.join(outDir, 'index.js'), indexContent);
  validatePublicFiles(definitions.map(def => def.dashCaseName));
}

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
