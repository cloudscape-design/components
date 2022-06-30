// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
const path = require('path');
const micromatch = require('micromatch');

const tryExtensions = ['.ts', '.tsx', '.js'];

function checkPath(filePath, bannedFileConfig, node, context) {
  for (const bannedFile of bannedFileConfig) {
    const { pattern, message } = bannedFile;

    if (micromatch.isMatch(filePath, pattern)) {
      context.report({
        node: node.source,
        message: `${message}`,
        data: {
          path: path.relative(process.cwd(), filePath),
        },
      });
    }
  }
}

module.exports = {
  meta: {
    schema: [
      {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            pattern: {
              type: 'string',
            },
            message: {
              type: 'string',
            },
          },
        },
      },
    ],
  },
  create(context) {
    const bannedFileConfig = context.options[0].map(item => {
      return {
        ...item,
        pattern: path.resolve(item.pattern),
      };
    });

    const sourcePath = context.getFilename();
    return {
      ImportDeclaration(node) {
        const importedPath = node.source.value;
        if (importedPath.startsWith('.')) {
          const resolvedPath = path.resolve(path.dirname(sourcePath), importedPath);
          checkPath(resolvedPath, bannedFileConfig, node, context);
          for (const ext of tryExtensions) {
            checkPath(`${resolvedPath}${ext}`, bannedFileConfig, node, context);
            checkPath(`${path.join(resolvedPath, 'index')}${ext}`, bannedFileConfig, node, context);
          }
        }
      },
    };
  },
};
