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
    const { locale, messages } = require(filePath);

    const parsedMessages = Object.fromEntries(
      Object.entries(messages).map(([component, messages]) => [
        component,
        Object.fromEntries(Object.entries(messages).map(([key, icuMessage]) => [key, parse(icuMessage, { locale })])),
      ])
    );

    writeFile(
      path.join(targetPath, 'components/internal/i18n/messages', fileName),
      JSON.stringify({ locale, messages: parsedMessages })
    );
  }
  return Promise.resolve();
};
