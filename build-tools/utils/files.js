// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');

const prettierConfigPath = path.join(process.cwd(), '.prettierrc');
const prettierOptions = prettier.resolveConfig.sync(prettierConfigPath);

function prettify(filepath, content) {
  if (prettierOptions && ['.ts', '.js', '.json'].some(ext => filepath.endsWith(ext))) {
    return prettier.format(content, { ...prettierOptions, filepath });
  }
  return content;
}

function writeFile(filepath, content) {
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, prettify(filepath, content));
}

function listBetaVersions(baseDir) {
  return fs.readdirSync(baseDir).filter(elem => /^\d+\.\d+-beta$/.test(elem));
}

function listPublicItems(baseDir) {
  return fs
    .readdirSync(baseDir)
    .filter(
      elem =>
        !elem.startsWith('__') &&
        !elem.startsWith('.') &&
        elem !== 'internal' &&
        elem !== 'index.tsx' &&
        elem !== 'index.ts' &&
        elem !== 'interfaces.ts' &&
        elem !== 'test-utils' &&
        elem !== 'i18n' &&
        elem !== 'theming' &&
        elem !== 'contexts'
    );
}

module.exports = { writeFile, listPublicItems, listBetaVersions };
