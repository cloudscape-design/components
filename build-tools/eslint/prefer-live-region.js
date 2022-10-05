// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
module.exports = {
  meta: {
    type: 'problem',
    messages: {
      'prefer-live-region': 'JSX element uses aria-live property. Prefer using LiveRegion component instead.',
    },
    docs: {
      description:
        'Prevents direct use of aria-live attributes to avoid a known issue with NVDA (see https://github.com/nvaccess/nvda/issues/7996).',
    },
  },
  create(context) {
    return {
      JSXElement(node) {
        if (
          node.openingElement.attributes.some(
            attribute => attribute.type === 'JSXAttribute' && attribute.name.name === 'aria-live'
          )
        ) {
          context.report({
            node: node,
            messageId: 'prefer-live-region',
          });
        }
      },
    };
  },
};
