// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs-extra');
const path = require('path');
const globby = require('globby');
const prettier = require('prettier');
const { pascalCase } = require('change-case');
const { task } = require('../utils/gulp-utils');

const prettierConfigPath = path.join(process.cwd(), '.prettierrc');
const prettierOptions = prettier.resolveConfig.sync(prettierConfigPath);

async function buildI18nInterfaces() {
  const components = [];

  for (const messagesFilePath of await globby(`${process.cwd()}/i18n/messages/**/default.json`)) {
    const componentName = messagesFilePath
      .split('/')
      .slice(-2)[0]
      .replace(/\.json/, '');
    components.push(componentName);

    const interfacesFolderPath = path.join(process.cwd(), 'src', 'i18n', 'interfaces', componentName);
    const interfacesFilePath = path.join(interfacesFolderPath, 'index.ts');

    const messages = JSON.parse(await fs.readFile(messagesFilePath, 'utf-8'));
    const namespace = {};
    Object.entries(messages).forEach(([name, message]) => defineProperty(name, message, namespace));
    const interfacesFileContent = prettify(
      interfacesFilePath,
      `
      // Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
      // SPDX-License-Identifier: Apache-2.0
            
      export interface ${pascalCase(componentName)}I18n ${renderNamespace(namespace)}
      `
    );

    await fs.ensureDir(interfacesFolderPath);
    await fs.writeFile(interfacesFilePath, interfacesFileContent);
  }

  components.sort();

  const indexFilePath = path.join(process.cwd(), 'src', 'i18n', 'interfaces', 'index.ts');
  const indexFileContent = prettify(
    indexFilePath,
    `
    // Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
    // SPDX-License-Identifier: Apache-2.0

    ${components
      .map(componentName => `import { ${pascalCase(componentName)}I18n } from './${componentName}'`)
      .join('\n')}

    export interface ComponentsI18N {
      ${components.map(componentName => `['${componentName}']: ${pascalCase(componentName)}I18n;`).join('\n')}
    }

    export {${components.map(componentName => `${pascalCase(componentName)}I18n`).join(',')}}
    `
  );
  await fs.writeFile(indexFilePath, indexFileContent);
}

function renderNamespace(namespace) {
  return `{
      ${Object.entries(namespace)
        .map(([name, value]) => `'${name}': ${typeof value === 'string' ? value : renderNamespace(value)}`)
        .join(';\n')}
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
  return variables.length === 0
    ? 'string'
    : `({ ${variables.join(',')} }: { ${[...variables, ''].join(': string,')} }) => string`;
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
