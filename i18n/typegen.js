// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs-extra');
const path = require('path');
const globby = require('globby');
const prettier = require('prettier');
const { pascalCase } = require('change-case');

const prettierConfigPath = path.join(process.cwd(), '.prettierrc');
const prettierOptions = prettier.resolveConfig.sync(prettierConfigPath);

generateTypes();

async function generateTypes() {
  for (const messagesFilePath of await listMessagesPaths()) {
    const componentName = getComponentNameFromPath(messagesFilePath);
    const interfacesFilePath = messagesFilePath.replace(/en-GB\.json/, 'interfaces.ts');
    const messages = JSON.parse(await fs.readFile(messagesFilePath, 'utf-8'));

    const properties = Object.entries(messages).map(([name, message]) => `'${name}': ${definePropertyType(message)}`);

    const content = prettify(
      interfacesFilePath,
      `
        // Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
        // SPDX-License-Identifier: Apache-2.0

        // eslint-disable-next-line @typescript-eslint/no-empty-interface
        export interface ${componentName}I18n {
            ${properties.join(';\n')}
        }
    `
    );

    await fs.writeFile(interfacesFilePath, content);
  }
}

function definePropertyType() {
  return 'any';
}

function listMessagesPaths() {
  return globby(`${__dirname}/components/**/en-GB.json`);
}

function getComponentNameFromPath(messagesFilePath) {
  return pascalCase(
    messagesFilePath
      .split('/')
      .slice(-2)[0]
      .replace(/\.json/, '')
  );
}

function prettify(filepath, content) {
  if (prettierOptions && ['.ts', '.js', '.json'].some(ext => filepath.endsWith(ext))) {
    return prettier.format(content, { ...prettierOptions, filepath });
  }
  return content;
}
