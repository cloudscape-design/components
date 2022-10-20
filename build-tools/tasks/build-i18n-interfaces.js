// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs-extra');
const path = require('path');
const globby = require('globby');
const prettier = require('prettier');
const { pascalCase } = require('change-case');
const { task } = require('../utils/gulp-utils');

const messagesPath = path.join(process.cwd(), 'i18n', 'messages');
const i18nOutputPath = path.join(process.cwd(), 'src', 'i18n', 'interfaces');

const prettierConfigPath = path.join(process.cwd(), '.prettierrc');
const prettierOptions = prettier.resolveConfig.sync(prettierConfigPath);

async function buildI18nInterfaces() {
  const components = await generateComponentTypes();

  await writeIndexFile(components);

  await writeTokensFile();
}

async function generateComponentTypes() {
  const components = [];

  for (const messagesFilePath of await globby(path.join(messagesPath, '**/default.json'))) {
    const componentName = messagesFilePath
      .split('/')
      .slice(-2)[0]
      .replace(/\.json/, '');
    components.push(componentName);

    const interfacesFileContent = await generateInterfaceForJSON(`${pascalCase(componentName)}I18n`, messagesFilePath);
    
    const interfacesFolderPath = path.join(i18nOutputPath, componentName);
    const interfacesFilePath = path.join(interfacesFolderPath, 'index.ts');
    await fs.ensureDir(interfacesFolderPath);
    await fs.writeFile(interfacesFilePath, interfacesFileContent);
  }
  return components;
}


async function writeIndexFile(components) {
  const sorted = [...components].sort();
  const indexFilePath = path.join(i18nOutputPath, 'index.ts');
  const indexFileContent = prettify(
    indexFilePath,
    `
    // Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
    // SPDX-License-Identifier: Apache-2.0

    ${sorted
      .map(componentName => `import { ${pascalCase(componentName)}I18n } from './${componentName}'`)
      .join('\n')}

    export interface ComponentsI18N {
      ${sorted.map(componentName => `['${componentName}']: ${pascalCase(componentName)}I18n;`).join('\n')}
    }

    export {${sorted.map(componentName => `${pascalCase(componentName)}I18n`).join(',')}}
    `
  );
  await fs.writeFile(indexFilePath, indexFileContent);
}

async function generateInterfaceForJSON(interfaceName, jsonPath) {
  const messages = JSON.parse(await fs.readFile(jsonPath, 'utf-8'));
  const namespace = {};
  Object.entries(messages).forEach(([name, message]) => defineProperty(name, message, namespace));
  return prettify(
    'temp.ts',
    `
      // Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
      // SPDX-License-Identifier: Apache-2.0
            
      export interface ${interfaceName} ${renderNamespace(namespace)}
      `
  );
}

async function writeTokensFile() {
  const tokensDefinitionPath = path.join(messagesPath, 'tokens', 'default.json');

  const tokensInterface = await generateInterfaceForJSON('Tokens', tokensDefinitionPath);

  await fs.writeFile(path.join(i18nOutputPath, 'tokens.ts'), tokensInterface);
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
      const variableName = message.slice(startIndex + 2, endIndex);
      if (!variableName.startsWith('tokens.')) {
        variables.push();
      }
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
