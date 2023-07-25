// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');
const { parse } = require('@formatjs/icu-messageformat-parser');

const { targetPath } = require('../utils/workspace');
const { writeFile } = require('../utils/files');

const namespace = '@cloudscape-design/components';

const destinationDir = path.join(targetPath, 'components/i18n/messages');
const internalDestinationDir = path.join(targetPath, 'components/internal/i18n/messages');

const messagesDeclarationFile = `import { I18nProviderProps } from "../provider";
declare const messages: I18nProviderProps.Messages;
export default messages;
`;

const indexDeclarationFile = `import { I18nProviderProps } from "../provider";
export function importMessages(locale: string): Promise<ReadonlyArray<I18nProviderProps.Messages>>;
`;

module.exports = function generateI18nMessages() {
  const messagesDir = path.resolve(__dirname, '../../src/i18n/messages');
  const files = fs.readdirSync(messagesDir);

  const allParsedMessages = {};

  for (const fileName of files) {
    const filePath = path.join(messagesDir, fileName);
    const messages = require(filePath);
    const [subset, locale] = fileName.split('.');

    const parsedMessages = Object.fromEntries(
      Object.entries(messages).map(([component, keys]) => [
        component,
        Object.fromEntries(Object.entries(keys).map(([key, icuMessage]) => [key, parse(icuMessage, { locale })])),
      ])
    );
    allParsedMessages[locale] = { ...(allParsedMessages[locale] ?? {}), ...parsedMessages };
    const resultFormat = { [namespace]: { [locale]: parsedMessages } };

    for (const directory of [destinationDir, internalDestinationDir]) {
      writeFile(path.join(directory, `${subset}.${locale}.json`), JSON.stringify(resultFormat));
      writeFile(path.join(directory, `${subset}.${locale}.d.ts`), messagesDeclarationFile);
      writeFile(path.join(directory, `${subset}.${locale}.js`), `export default ${JSON.stringify(resultFormat)}`);
    }
  }

  // Generate a ".all" file containing all locales.
  const resultFormat = { [namespace]: allParsedMessages };

  // Generate a dynamic provider function for automatic bundler splitting and imports.
  const indexFile = [
    `export function importMessages(locale) {`,
    `  switch (locale) {`,
    ...files.flatMap(fileName => {
      const [subset, locale] = fileName.split('.');
      if (subset !== 'all') {
        return [];
      }
      return [`  case "${locale}":`, `    return import("./${subset}.${locale}.js").then(mod => [mod.default]);`];
    }),
    `  }`,
    `  return Promise.resolve([]);`,
    `}`,
  ].join('\n');

  for (const directory of [destinationDir, internalDestinationDir]) {
    writeFile(path.join(directory, 'all.all.json'), JSON.stringify(resultFormat));
    writeFile(path.join(directory, 'all.all.d.ts'), messagesDeclarationFile);
    writeFile(path.join(directory, 'all.all.js'), `export default ${JSON.stringify(resultFormat)}`);

    writeFile(path.join(directory, 'index.js'), indexFile);
    writeFile(path.join(directory, 'index.d.ts'), indexDeclarationFile);
  }

  return Promise.resolve();
};
