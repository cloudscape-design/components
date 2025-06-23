// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const { getHashDigest } = require('loader-utils');
const customCssPropertiesList = require('../utils/custom-css-properties');
const { writeFile } = require('../utils/files');
const workspace = require('../utils/workspace');

const outputBasePath = path.join(workspace.generatedPath, 'custom-css-properties');
const hash = getHashDigest(Buffer.from(JSON.stringify(customCssPropertiesList)), 'md5', 'base36', 6);

const getHashedProperty = property => {
  return `--awsui-${property.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}-${hash}`;
};

function writeJsFile() {
  const filepath = path.join(outputBasePath, 'index.ts');

  writeFile(
    filepath,
    `
      const customCSSPropertiesMap = {
        ${customCssPropertiesList.map(property => `"${property}": "${getHashedProperty(property)}",`).join('\n')}
      };
      export default customCSSPropertiesMap;
    `
  );
}

function writeSassFile() {
  const filepath = path.join(outputBasePath, 'index.scss');

  writeFile(
    filepath,
    `
    // Build environment
    $awsui-commit-hash: ${workspace.gitCommitVersion};
    // Manually managed CSS-variables
    ${customCssPropertiesList.map(property => `$${property}: ${getHashedProperty(property)};`).join('\n')}
    `
  );
}

module.exports = function generateCustomCssPropertiesMap() {
  writeJsFile();
  writeSassFile();
  return Promise.resolve();
};
