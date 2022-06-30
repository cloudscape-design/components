// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
module.exports = {
  meta: {
    type: 'problem',
    messages: {
      'no-implicit-svg-focusable':
        '<svg> element without explicit `focusable` attribute may work incorrectly in IE. Please add `focusable` attribute.',
    },
    docs: {
      description: 'prevents use of <svg> tag without focusable attribute, because it is broken in Internet Explorer',
    },
  },
  create(context) {
    return {
      JSXElement(node) {
        if (
          node.openingElement.name.name === 'svg' &&
          !node.openingElement.attributes.some(
            attribute => attribute.type === 'JSXAttribute' && attribute.name.name === 'focusable'
          )
        ) {
          context.report({
            node: node,
            messageId: 'no-implicit-svg-focusable',
          });
        }
      },
    };
  },
};
