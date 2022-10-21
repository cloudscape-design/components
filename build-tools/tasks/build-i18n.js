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
const i18nOutputMessagesPath = path.join(process.cwd(), 'src', 'i18n', 'messages');
const i18nOutputExportsPath = path.join(process.cwd(), 'src', 'i18n', 'exports');

const prettierConfigPath = path.join(process.cwd(), '.prettierrc');
const prettierOptions = prettier.resolveConfig.sync(prettierConfigPath);

const locales = ['default', 'de-DE'];

const messageGroups = [
  {
    name: 'core',
    components: [
      'alert',
      'autosuggest',
      'badge',
      'box',
      'button-dropdown',
      'button',
      'checkbox',
      'column-layout',
      'container',
      'expandable-section',
      'flashbar',
      'form-field',
      'form',
      'grid',
      'header',
      'icon',
      'input',
      'link',
      'modal',
      'multiselect',
      'popover',
      'progress-bar',
      'radio-group',
      'segmented-control',
      'select',
      'space-between',
      'spinner',
      'status-indicator',
      'tabs',
      'text-content',
      'textarea',
      'tiles',
      'toggle',
      'token-group',
    ],
  },
  {
    name: 'date-time',
    components: ['calendar', 'date-input', 'date-picker', 'date-range-picker', 'time-input'],
  },
  { name: 'charts', components: ['area-chart', 'bar-chart', 'line-chart', 'mixed-line-bar-chart', 'pie-chart'] },
  { name: 'collection', components: ['cards', 'collection-preferences', 'table', 'pagination', 'property-filter'] },
  {
    name: 'layout',
    components: [
      'app-layout',
      'breadcrumb-group',
      'content-layout',
      'help-panel',
      'side-navigation',
      'split-panel',
      'top-navigation',
    ],
  },
  { name: 'code-editor', components: ['code-editor'] },
  { name: 's3-resource-selector', components: ['s3-resource-selector'] },
  { name: 'tutorials', components: ['annotation-context', 'tutorial-panel', 'hotspot'] },
  { name: 'attribute-editor', components: ['attribute-editor'] },
  { name: 'tag-editor', components: ['tag-editor'] },
  { name: 'wizard', components: ['wizard'] },
];

const allMessages = messageGroups.reduce((acc, { components }) => [...acc, ...components], []);
messageGroups.push({ name: 'all', components: [...new Set(allMessages)].sort() });

async function buildI18n() {
  const components = await generateComponentTypes();

  await writeIndexFile(components);

  await writeTokensFile();
}

async function generateComponentTypes() {
  const components = [];

  for (const sourceFilePath of await globby(path.join(messagesPath, '**/default.json'))) {
    try {
      const componentName = sourceFilePath
        .split('/')
        .slice(-2)[0]
        .replace(/\.json/, '');
      components.push(componentName);

      const dictionary = await getDictionary(sourceFilePath);
      const interfacesFileContent = generateInterfaceForJSON(componentName, dictionary.default, dictionary.meta);

      const interfacesFolderPath = path.join(i18nOutputPath, componentName);
      const interfacesFilePath = path.join(interfacesFolderPath, 'index.ts');
      await fs.ensureDir(interfacesFolderPath);
      await fs.writeFile(interfacesFilePath, interfacesFileContent);

      for (const locale of locales) {
        const messagesFileContent = generateMessagesForJSON(
          componentName,
          dictionary.default,
          dictionary[locale],
          dictionary.meta
        );
        const messagesFolderPath = path.join(i18nOutputMessagesPath, locale);
        await fs.ensureDir(messagesFolderPath);
        const messagesFilePath = path.join(messagesFolderPath, `${componentName}.ts`);
        await fs.writeFile(messagesFilePath, messagesFileContent);
      }

      for (const locale of locales) {
        for (const group of messageGroups) {
          const exportsFolderPath = path.join(i18nOutputExportsPath, locale);
          await fs.ensureDir(exportsFolderPath);
          const exportsFilePath = path.join(exportsFolderPath, `${group.name}.ts`);

          const exportsFileContent = prettify(
            'temp.ts',
            `
            // Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
            // SPDX-License-Identifier: Apache-2.0
        
            ${group.components
              .map(
                componentName => `import ${pascalCase(componentName)} from '../../messages/${locale}/${componentName}';`
              )
              .join('\n')}
            
            export default {
              ${group.components.map(componentName => `'${componentName}': ${pascalCase(componentName)},`).join('\n')}
            }
            `
          );

          await fs.writeFile(exportsFilePath, exportsFileContent);
        }
      }
    } catch (error) {
      console.error('ERROR', sourceFilePath, error);
    }
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

    ${sorted.map(componentName => `import { ${pascalCase(componentName)}I18n } from './${componentName}'`).join('\n')}

    export interface ComponentsI18N {
      ${sorted.map(componentName => `['${componentName}']: ${pascalCase(componentName)}I18n;`).join('\n')}
    }

    export {${sorted.map(componentName => `${pascalCase(componentName)}I18n`).join(',')}}
    `
  );
  await fs.writeFile(indexFilePath, indexFileContent);
}

async function getDictionary(defaultJsonPath) {
  const dictionary = {};
  for (const locale of locales) {
    const localeJsonPath = defaultJsonPath.replace(/[\w-]+\.json$/, `${locale}.json`);
    dictionary[locale] = JSON.parse(await fs.readFile(localeJsonPath, 'utf-8'));
  }
  const metaJsonPath = defaultJsonPath.replace(/[\w-]+\.json$/, 'meta.json');
  if (fs.existsSync(metaJsonPath)) {
    dictionary.meta = JSON.parse(await fs.readFile(metaJsonPath, 'utf-8'));
  }
  return dictionary;
}

function generateInterfaceForJSON(componentName, messages, messagesMeta) {
  const namespace = {};
  Object.entries(messages)
    .filter(([name]) => name !== 'enums')
    .forEach(([name, message]) => defineProperty(componentName, name, message, messagesMeta?.[name], namespace));
  const definition = renderNamespace(namespace);
  return prettify(
    'temp.ts',
    `
      // Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
      // SPDX-License-Identifier: Apache-2.0

      ${
        definition.indexOf(`${pascalCase(componentName)}Props`) !== -1
          ? `import {${pascalCase(componentName)}Props} from '../../../${componentName}/interfaces'`
          : ''
      }
            
      export interface ${`${pascalCase(componentName)}I18n`} ${definition}
      `
  );
}

function generateMessagesForJSON(componentName, defaultMessages, localeMessages, messagesMeta) {
  const namespace = {};
  Object.entries(defaultMessages)
    .filter(([name]) => name !== 'enums')
    .forEach(([name, message]) =>
      defineMessagesProperty(
        componentName,
        name,
        message,
        localeMessages[name] ?? message,
        messagesMeta?.[name],
        namespace
      )
    );
  const definition = renderMessagesNamespace(namespace);
  return prettify(
    'temp.ts',
    `
    // Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
    // SPDX-License-Identifier: Apache-2.0

    ${definition.indexOf(`Tokens.`) !== -1 ? `import Tokens from './tokens';` : ''}
    import { ${pascalCase(componentName)}I18n } from '../../interfaces';

    ${localeMessages.enums ? `const enums = ${JSON.stringify(localeMessages.enums)} as const;` : ''}
          
    const messages: ${pascalCase(componentName)}I18n = ${definition};

    export default messages;
      `
  );
}

async function writeTokensFile() {
  const tokensDefinitionPath = path.join(messagesPath, 'tokens', 'default.json');
  const dictionary = await getDictionary(tokensDefinitionPath);

  const tokensInterface = generateInterfaceForJSON('Tokens', dictionary.default, dictionary.meta);

  await fs.writeFile(path.join(i18nOutputPath, 'tokens.ts'), tokensInterface);

  for (const locale of locales) {
    const tokensMessages = generateMessagesForJSON('Tokens', dictionary.default, dictionary[locale], dictionary.meta);
    await fs.writeFile(path.join(i18nOutputMessagesPath, locale, 'tokens.ts'), tokensMessages);
  }
}

function renderNamespace(namespace) {
  return `{
      ${Object.entries(namespace)
        .map(([name, value]) => `'${name}': ${typeof value === 'string' ? value : renderNamespace(value)}`)
        .join(';\n')}
  }`;
}

function renderMessagesNamespace(namespace) {
  return `{
      ${Object.entries(namespace)
        .map(([name, value]) => `'${name}': ${typeof value === 'string' ? value : renderMessagesNamespace(value)}`)
        .join(',\n')}
  }`;
}

function defineProperty(componentName, name, message, messageMeta, namespace) {
  const [rootName, ...restName] = name.split('.');

  if (restName.length === 0) {
    namespace[rootName] = definePropertyType(componentName, message, messageMeta);
  } else {
    if (!namespace[rootName]) {
      namespace[rootName] = {};
    }
    defineProperty(componentName, restName.join('.'), message, messageMeta, namespace[rootName]);
  }
}

function defineMessagesProperty(componentName, name, message, localeMessage, messageMeta, namespace) {
  const [rootName, ...restName] = name.split('.');

  if (restName.length === 0) {
    namespace[rootName] = definePropertyValue(componentName, message, localeMessage, messageMeta);
  } else {
    if (!namespace[rootName]) {
      namespace[rootName] = {};
    }
    defineMessagesProperty(componentName, restName.join('.'), message, localeMessage, messageMeta, namespace[rootName]);
  }
}

function definePropertyType(componentName, message, messageMeta) {
  const args = captureArguments(componentName, message, messageMeta);
  return args.length === 0 ? 'string' : `(${args.map(arg => `${arg[0]}: ${arg[1]}`).join(',')}) => string`;
}

function definePropertyValue(componentName, message, localeMessage, messageMeta) {
  const args = captureArguments(componentName, message, messageMeta);
  localeMessage = localeMessage.replace(/\$ARG\{\w+\}/g, '');
  return args.length === 0 ? `\`${localeMessage}\`` : `(${args.map(arg => arg[0]).join(',')}) => \`${localeMessage}\``;
}

function captureArguments(componentName, message, messageMeta) {
  if (!messageMeta || !messageMeta.arguments) {
    return [];
  }
  return Object.entries(messageMeta.arguments).map(([argName, argType]) => {
    if (argType[0] === argType[0].toLowerCase()) {
      return [argName, argType];
    }
    return [argName, `${pascalCase(componentName)}Props.${argType}`];
  });
}

function prettify(filepath, content) {
  if (prettierOptions && ['.ts', '.js', '.json'].some(ext => filepath.endsWith(ext))) {
    return prettier.format(content, { ...prettierOptions, filepath });
  }
  return content;
}

module.exports = task('build-i18n', buildI18n);
