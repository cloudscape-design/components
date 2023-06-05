// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const customCssPropertiesList = require('../../src/internal/generated/custom-css-properties/list');
const path = require('path');
const { writeFile } = require('../utils/files');
const { getHashDigest } = require('loader-utils');

const outputBasePath = path.join(__dirname, '../../src/internal/generated/custom-css-properties');
const hash = getHashDigest(Buffer.from(JSON.stringify(customCssPropertiesList.scoped)), 'md5', 'base36', 6);

const getScopedProperty = property => {
  return `${getGlobalProperty(property)}-${hash}`;
};

const getGlobalProperty = property => {
  return `--awsui-${property.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}`;
};

function writeJsFile() {
  const filepath = path.join(outputBasePath, 'index.ts');

  writeFile(
    filepath,
    `
      const customCSSPropertiesMap: Record<string,string> = {
        ${customCssPropertiesList.globals
          .map(property => `"${property}": "${getGlobalProperty(property)}",`)
          .join('\n')}
        ${customCssPropertiesList.scoped.map(property => `"${property}": "${getScopedProperty(property)}",`).join('\n')}
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
    ${customCssPropertiesList.globals.map(property => `$${property}: ${getGlobalProperty(property)};`).join('\n')}
    ${customCssPropertiesList.scoped.map(property => `$${property}: ${getScopedProperty(property)};`).join('\n')}
    `
  );
}

module.exports = function generateCustomCssPropertiesMap() {
  writeJsFile();
  writeSassFile();
  return Promise.resolve();
};
