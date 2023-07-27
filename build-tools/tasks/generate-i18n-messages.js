// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');
const { parse } = require('@formatjs/icu-messageformat-parser');

const { targetPath } = require('../utils/workspace');
const { writeFile } = require('../utils/files');

const sourceI18nDir = path.resolve(__dirname, '../../src/i18n');
const sourceMessagesDir = path.resolve(sourceI18nDir, 'messages');
const targetI18nDir = path.resolve(targetPath, 'components/i18n');
const targetMessagesDir = path.resolve(targetI18nDir, 'messages');

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

    writeFile(path.join(targetMessagesDir, `${subset}.${locale}.json`), JSON.stringify(resultFormat));
    writeFile(path.join(targetMessagesDir, `${subset}.${locale}.d.ts`), messagesDeclarationFile);
    writeFile(path.join(targetMessagesDir, `${subset}.${locale}.js`), `export default ${JSON.stringify(resultFormat)}`);
  }

  // Generate a ".all" file containing all locales.
  const allResultFormat = { [namespace]: allParsedMessages };
  writeFile(path.join(targetMessagesDir, 'all.all.json'), JSON.stringify(allResultFormat));
  writeFile(path.join(targetMessagesDir, 'all.all.d.ts'), messagesDeclarationFile);
  writeFile(path.join(targetMessagesDir, 'all.all.js'), `export default ${JSON.stringify(allResultFormat)}`);

  // Generate a dynamic provider function for automatic bundler splitting and imports.
  const dynamicFile = [
    `import { warnOnce } from '@cloudscape-design/component-toolkit/internal';
import { isDevelopment } from '../internal/is-development';
import { getMatchableLocales } from './get-matchable-locales';

export function importMessages(locale) {
  for (const matchableLocale of getMatchableLocales(locale)) {
    switch (matchableLocale.toLowerCase()) {`,
    ...files.flatMap(fileName => {
      const [subset, locale] = fileName.split('.');
      if (subset !== 'all') {
        return []; // For now, this only supports loading all messages for the locale.
      }
      return [
        `    case "${locale.toLowerCase()}":
      return import("./messages/${subset}.${locale}.js").then(mod => [mod.default]);`,
      ];
    }),
    `    }
  }

  if (isDevelopment) {
    warnOnce('importMessages', \`Unknown locale "\${locale}" provided to importMessages\`)
  }

  return Promise.resolve([]);
}`,
  ].join('\n');

  fs.copyFileSync(path.join(sourceI18nDir, 'dynamic.d.ts'), path.join(targetI18nDir, 'dynamic.d.ts'));
  writeFile(path.join(targetI18nDir, 'dynamic.js'), dynamicFile);

  return Promise.resolve();
};
