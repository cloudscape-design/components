// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { pascalCase } = require('change-case');
const { writeFile, listPublicItems } = require('../utils/files');

const footer = `export * from './interfaces.js';\n`;

module.exports = function generateIndexFile() {
  const content = listPublicItems('src')
    .map(componentDir => {
      const componentName = pascalCase(componentDir);
      return `export { default as ${componentName}, ${componentName}Props } from './${componentDir}/index.js';\n`;
    })
    .join('');
  writeFile('src/index.ts', content + footer);
  return Promise.resolve();
};
