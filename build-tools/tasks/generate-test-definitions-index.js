// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const fs = require('fs');
const path = require('path');

const { writeFile } = require('../utils/files');

const DEFINITIONS_DIR = 'test/definitions/visual';
const OUTPUT_DIR = 'lib/test-definitions';

const header = `// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// This file is generated from the definitions in ${DEFINITIONS_DIR}.
// Do not edit it manually.
`;

// action-card -> actionCard
function toCamelCase(kebab) {
  return kebab.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Collects the visual definition file names (without extension).
function collectDefinitions() {
  return fs
    .readdirSync(DEFINITIONS_DIR)
    .filter(file => file.endsWith('.ts'))
    .map(file => path.basename(file, '.ts'))
    .sort();
}

function generateIndexJs(definitions) {
  const lines = definitions.map(file => {
    const exportName = toCamelCase(file);
    return `exports.${exportName} = require('./visual/${file}').default;`;
  });

  return (
    header +
    `'use strict';\n` +
    `Object.defineProperty(exports, '__esModule', { value: true });\n\n` +
    lines.join('\n') +
    `\n`
  );
}

function generateIndexDts(definitions) {
  const lines = definitions.map(file => `export declare const ${toCamelCase(file)}: TestSuite;`);

  return (
    header +
    `import { TestSuite } from './types';\n` +
    `export { TestSuite, TestDefinition, ScreenshotType, ScreenshotTestConfiguration } from './types';\n\n` +
    lines.join('\n') +
    `\n`
  );
}

module.exports = function generateTestDefinitionsIndex() {
  const definitions = collectDefinitions();
  writeFile(path.join(OUTPUT_DIR, 'index.js'), generateIndexJs(definitions));
  writeFile(path.join(OUTPUT_DIR, 'index.d.ts'), generateIndexDts(definitions));
  return Promise.resolve();
};
