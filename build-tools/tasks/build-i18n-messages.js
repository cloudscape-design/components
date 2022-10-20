// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs-extra');
const path = require('path');
const globby = require('globby');
const prettier = require('prettier');
const { task } = require('../utils/gulp-utils');
const { pascalCase } = require('change-case');

const prettierConfigPath = path.join(process.cwd(), '.prettierrc');
const prettierOptions = prettier.resolveConfig.sync(prettierConfigPath);

const locales = ['default', 'de-DE'];

async function buildI18nInterfaces() {
  for (const locale of locales) {
    for (const messagesFilePath of await globby(`${process.cwd()}/i18n/messages/**/${locale}.json`)) {
      if (!messagesFilePath.includes('property-filter')) {
        continue;
      }

      const componentName = messagesFilePath
        .split('/')
        .slice(-2)[0]
        .replace(/\.json/, '');

      const destinationFolder = path.join(process.cwd(), 'src', 'i18n', 'messages', locale);
      const destinationFilePath = path.join(destinationFolder, `${componentName}.ts`);

      const messages = JSON.parse(await fs.readFile(messagesFilePath, 'utf-8'));
      const namespace = {};
      Object.entries(messages).forEach(([name, message]) => defineProperty(name, message, namespace));

      const interfacesFileContent = prettify(
        destinationFilePath,
        `
          // Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
          // SPDX-License-Identifier: Apache-2.0

          import { ${pascalCase(componentName)}I18n } from '../../interfaces';
                
          const messages: ${pascalCase(componentName)}I18n = ${renderNamespace(namespace)};

          export default messages;
          `
      );

      await fs.ensureDir(destinationFolder);
      await fs.writeFile(destinationFilePath, interfacesFileContent);
    }
  }
}

function renderNamespace(namespace) {
  return `{
      ${Object.entries(namespace)
        .map(([name, value]) => `'${name}': ${typeof value === 'string' ? value : renderNamespace(value)}`)
        .join(',\n')}
  }`;
}

function defineProperty(name, message, namespace) {
  const [rootName, ...restName] = name.split('.');

  if (restName.length === 0) {
    namespace[rootName] = definePropertyType(message);
  } else {
    if (!namespace[rootName]) {
      namespace[rootName] = {};
    }
    defineProperty(restName.join('.'), message, namespace[rootName]);
  }
}

function definePropertyType(message) {
  const variables = captureVariables(message);
  return variables.length === 0 ? `"${message}"` : `({ ${variables.join(',')} }) => \`${message}\``;
}

function captureVariables(message) {
  const variables = [];

  let searchIndex = 0;
  do {
    const startIndex = message.indexOf('${', searchIndex);
    const endIndex = startIndex !== -1 ? message.indexOf('}', startIndex) : -1;
    if (startIndex !== -1 && endIndex !== -1) {
      variables.push(message.slice(startIndex + 2, endIndex));
    }
    searchIndex = endIndex;
  } while (searchIndex !== -1);

  return variables;
}

function prettify(filepath, content) {
  if (prettierOptions && ['.ts', '.js', '.json'].some(ext => filepath.endsWith(ext))) {
    return prettier.format(content, { ...prettierOptions, filepath });
  }
  return content;
}

module.exports = task('build-i18n-interfaces', buildI18nInterfaces);
