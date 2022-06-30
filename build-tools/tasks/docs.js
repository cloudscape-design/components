// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const { paramCase } = require('change-case');
const { documentComponents, documentTestUtils } = require('@cloudscape-design/documenter');
const { writeFile } = require('../utils/files');
const { listPublicItems } = require('../utils/files');
const workspace = require('../utils/workspace');
const { buildDocumentation: designTokenDocs } = require('../design-tokens');

module.exports = function docs() {
  componentDocs();
  testUtilDocs();
  designTokenDocs();
  return Promise.resolve();
};

function validatePublicFiles(definitionFiles) {
  const publicDirs = listPublicItems('src');
  for (const publicDir of publicDirs) {
    if (!definitionFiles.includes(publicDir)) {
      throw new Error(`Directory src/${publicDir} does not have a corresponding API definition`);
    }
  }
}

function componentDocs() {
  const definitions = documentComponents(require.resolve('../../tsconfig.json'), 'src/*/index.tsx');
  const outDir = path.join(workspace.apiDocsPath, 'components');
  const fileNames = definitions.map(definition => {
    const fileName = paramCase(definition.name);
    writeFile(path.join(outDir, fileName + '.js'), `module.exports = ${JSON.stringify(definition, null, 2)};`);
    return fileName;
  });
  validatePublicFiles(fileNames);
  const indexContent = `module.exports = {
    ${fileNames.map(name => `${JSON.stringify(name)}:require('./${name}')`).join(',\n')}
  }`;
  writeFile(path.join(outDir, 'index.js'), indexContent);
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
