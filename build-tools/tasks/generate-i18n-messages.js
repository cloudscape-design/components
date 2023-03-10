// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const fs = require('fs');
const path = require('path');
const MessageFormat = require('@messageformat/core');
const compileModule = require('@messageformat/core/compile-module');

const { targetPath } = require('../utils/workspace');
const { writeFile } = require('../utils/files');

const declarationFile = `
const I18nMessages: Record<string, Record<string, (input?: Record<string, string>) => string>>;
export default I18nMessages;`;

module.exports = function generateI18nModules() {
  const messagesDir = path.resolve(__dirname, '../../src/internal/i18n/messages');
  const files = fs.readdirSync(messagesDir);
  for (const fileName of files) {
    const filePath = path.join(messagesDir, fileName);
    const { locale, messages } = require(filePath);
    const mf = new MessageFormat(locale);
    const compiledModule = compileModule(mf, messages);
    writeFile(
      path.join(targetPath, 'components/internal/i18n/messages', fileName.replace(/\.json$/, '.js')),
      compiledModule
    );
    writeFile(
      path.join(targetPath, 'components/internal/i18n/messages', fileName.replace(/\.json$/, '.d.ts')),
      declarationFile
    );
  }
  return Promise.resolve();
};
