// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import stylelint from 'stylelint';

const ruleName = '@cloudscape-design/license-headers';
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: 'Missing license header',
});

function licenseHeadersPlugin(enabled, { header }, context) {
  if (!enabled) {
    return;
  }

  if (!header) {
    throw new Error(`stylelint ${ruleName} rule requires a header option.`);
  }

  const trimmedHeader = header.trim();

  return (root, result) => {
    let foundComment = false;
    let firstComment = null;

    root.walkComments(function (comment) {
      if (comment.parent.type === 'root' && comment === comment.parent.first) {
        if (!firstComment) {
          firstComment = comment;
        }

        if (comment.text.trim() === trimmedHeader) {
          foundComment = true;
        }
      }
    });

    if (!foundComment) {
      if (context.fix) {
        const newComment = `/*${header}*/\n\n`;
        root.prepend(newComment);
      } else {
        stylelint.utils.report({
          message: messages.rejected,
          node: firstComment || root,
          result,
          ruleName,
        });
      }
    }
  };
}

licenseHeadersPlugin.ruleName = ruleName;
licenseHeadersPlugin.messages = messages;

export default stylelint.createPlugin(ruleName, licenseHeadersPlugin);
