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

// Reads the `componentName` field from a definition source file, falling back
// to the file name when it is absent.
function readComponentName(file, fallback) {
  const contents = fs.readFileSync(file, 'utf8');
  const match = contents.match(/componentName:\s*'([^']+)'/);
  return match ? match[1] : fallback;
}

// Collects the visual definitions and groups their file names by component.
function collectComponents() {
  const files = fs
    .readdirSync(DEFINITIONS_DIR)
    .filter(file => file.endsWith('.ts'))
    .map(file => path.basename(file, '.ts'))
    .sort();

  // Preserve first-seen order of components so the output is deterministic.
  const components = new Map();
  for (const name of files) {
    const componentName = readComponentName(path.join(DEFINITIONS_DIR, `${name}.ts`), name);
    if (!components.has(componentName)) {
      components.set(componentName, []);
    }
    components.get(componentName).push(name);
  }
  return components;
}

function generateIndexJs(components) {
  const importNames = new Map();
  const importLines = [];
  for (const files of components.values()) {
    for (const file of files) {
      const importName = `${toCamelCase(file)}Suite`;
      importNames.set(file, importName);
      importLines.push(`const ${importName} = require('./visual/${file}').default;`);
    }
  }

  const componentLines = [];
  for (const [componentName, files] of components) {
    const exportName = toCamelCase(componentName);
    const suites = files.map(file => importNames.get(file)).join(', ');
    componentLines.push(`const ${exportName} = [${suites}];`);
    componentLines.push(`exports.${exportName} = ${exportName};`);
  }

  return (
    header +
    `'use strict';\n` +
    `Object.defineProperty(exports, '__esModule', { value: true });\n\n` +
    importLines.join('\n') +
    `\n\n` +
    componentLines.join('\n') +
    `\n`
  );
}

function generateIndexDts(components) {
  const componentLines = [...components.keys()].map(name => `export declare const ${toCamelCase(name)}: TestSuite[];`);

  return (
    header +
    `import { TestSuite } from './types';\n` +
    `export { TestSuite, TestDefinition, ScreenshotType, ScreenshotTestConfiguration } from './types';\n\n` +
    componentLines.join('\n') +
    `\n`
  );
}

module.exports = function generateTestDefinitionsIndex() {
  const components = collectComponents();
  writeFile(path.join(OUTPUT_DIR, 'index.js'), generateIndexJs(components));
  writeFile(path.join(OUTPUT_DIR, 'index.d.ts'), generateIndexDts(components));
  return Promise.resolve();
};
