// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');
const { parse } = require('@formatjs/icu-messageformat-parser');

const { targetPath } = require('../utils/workspace');
const { writeFile } = require('../utils/files');

module.exports = function generateI18nMessages() {
  const messagesDir = path.resolve(__dirname, '../../src/internal/i18n/messages');
  const files = fs.readdirSync(messagesDir);
  for (const fileName of files) {
    const filePath = path.join(messagesDir, fileName);
    const messages = require(filePath);

    const parsedMessages = Object.fromEntries(
      Object.entries(messages).map(([namespace, locales]) => [
        namespace,
        Object.fromEntries(
          Object.entries(locales).map(([locale, components]) => [
            locale,
            Object.fromEntries(
              Object.entries(components).map(([component, keys]) => [
                component,
                Object.fromEntries(
                  Object.entries(keys).map(([key, icuMessage]) => [key, parse(icuMessage, { locale })])
                ),
              ])
            ),
          ])
        ),
      ])
    );

    writeFile(path.join(targetPath, 'components/internal/i18n/messages', fileName), JSON.stringify(parsedMessages));

    // FIXME: HACK: Maybe this is worth keeping?
    writeFile(
      path.join(targetPath, 'components/internal/i18n/messages', fileName.replace(/\.json$/, '.d.ts')),
      `import { I18nProviderProps } from "../provider";\nconst messages: I18nProviderProps.Messages;\nexport default messages;\n`
    );
    writeFile(
      path.join(targetPath, 'components/internal/i18n/messages', fileName.replace(/\.json$/, '.js')),
      `export default ${JSON.stringify(parsedMessages)}`
    );
  }
  return Promise.resolve();
};
