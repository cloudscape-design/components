// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');
const { parse } = require('@formatjs/icu-messageformat-parser');

const { targetPath } = require('../utils/workspace');
const { writeFile } = require('../utils/files');

const sourceDir = path.resolve(__dirname, '../../src/i18n');
const sourceMessagesDir = path.resolve(sourceDir, 'messages');
const destinationDir = path.resolve(targetPath, 'components/i18n');
const destinationMessagesDir = path.resolve(destinationDir, 'messages');
const internalDestinationDir = path.resolve(targetPath, 'components/internal/i18n');
const internalDestinationMessagesDir = path.resolve(internalDestinationDir, 'messages');

const namespace = '@cloudscape-design/components';
const messagesDeclarationFile = `import { I18nProviderProps } from "../provider";
declare const messages: I18nProviderProps.Messages;
export default messages;
`;

module.exports = function generateI18nMessages() {
  const files = fs.readdirSync(sourceMessagesDir);
  const allParsedMessages = {};

  // Generate individual locale messages files.
  for (const fileName of files) {
    const filePath = path.join(sourceMessagesDir, fileName);
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

    for (const directory of [destinationMessagesDir, internalDestinationMessagesDir]) {
      writeFile(path.join(directory, `${subset}.${locale}.json`), JSON.stringify(resultFormat));
      writeFile(path.join(directory, `${subset}.${locale}.d.ts`), messagesDeclarationFile);
      writeFile(path.join(directory, `${subset}.${locale}.js`), `export default ${JSON.stringify(resultFormat)}`);
    }
  }

  // Generate a ".all" file containing all locales.
  const allResultFormat = { [namespace]: allParsedMessages };
  for (const directory of [destinationMessagesDir, internalDestinationMessagesDir]) {
    writeFile(path.join(directory, 'all.all.json'), JSON.stringify(allResultFormat));
    writeFile(path.join(directory, 'all.all.d.ts'), messagesDeclarationFile);
    writeFile(path.join(directory, 'all.all.js'), `export default ${JSON.stringify(allResultFormat)}`);
  }

  // Generate a dynamic provider function for automatic bundler splitting and imports.
  const dynamicFile = [
    `export function importMessages(locale) {`,
    `  switch (locale.toLowerCase()) {`,
    ...files.flatMap(fileName => {
      const [subset, locale] = fileName.split('.');
      if (subset !== 'all') {
        return []; // For now, this only supports loading all messages for the locale.
      }
      return [
        `  case "${locale.toLowerCase()}":`,
        `    return import("./messages/${subset}.${locale}.js").then(mod => [mod.default]);`,
      ];
    }),
    `  }`,
    `  return Promise.resolve([]);`,
    `}`,
  ].join('\n');
  fs.copyFileSync(path.join(sourceDir, 'dynamic.d.ts'), path.join(destinationDir, 'dynamic.d.ts'));
  writeFile(path.join(destinationDir, 'dynamic.js'), dynamicFile);

  return Promise.resolve();
};
