// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable @typescript-eslint/no-require-imports */

const path = require('path');
const { paramCase } = require('change-case');
const { documentTestUtils } = require('@cloudscape-design/documenter');
const { compileTypescript } = require('./typescript');
const { writeFile } = require('../utils/files');
const { listPublicItems } = require('../utils/files');
const workspace = require('../utils/workspace');

module.exports = async function docs() {
  await componentDocs();
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

async function componentDocs() {
  await compileTypescript({
    name: 'documenter',
    tsConfigPath: 'build-tools/documenter-new/tsconfig.json',
    outputPath: 'lib/documenter-new',
  })();
  const { documentComponents } = require('../../lib/documenter-new/index.js');
  // const { documentComponents } = require('@cloudscape-design/documenter');
  const definitions = documentComponents(require.resolve('../../tsconfig.json'), 'src/*/index.tsx', {
    extraExports: {
      FileDropzone: ['useFilesDragging'],
      TagEditor: ['getTagsDiff'],
    },
  });
  const outDir = path.join(workspace.apiDocsPath, 'components');
  const fileNames = definitions
    .filter(definition => {
      const fileName = paramCase(definition.name);
      if (!publicDirs.includes(fileName)) {
        console.warn(`Excluded "${fileName}" from components definitions.`);
        return false;
      }
      return true;
    })
    .map(definition => {
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
