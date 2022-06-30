// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const { pascalCase } = require('change-case');
const { writeFile, listPublicItems } = require('../utils/files');

const footer = `export * from './interfaces';\n`;

module.exports = function generateIndexFile() {
  const content = listPublicItems('src')
    .map(componentDir => {
      const componentName = pascalCase(componentDir);
      return `export { default as ${componentName}, ${componentName}Props } from './${componentDir}';\n`;
    })
    .join('');
  writeFile('src/index.ts', content + footer);
  return Promise.resolve();
};
