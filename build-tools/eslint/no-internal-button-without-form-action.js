// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
module.exports = {
  meta: {
    type: 'problem',
    messages: {
      'no-internal-button-without-form-action':
        '<InternalButton> component does not have a `formAction` property. The default of "submit" may cause unexpected form submissions.',
    },
    docs: {
      description: 'Prevents <InternalButton> component to be rendered without an explicit `formAction`.',
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (
          node.name.name === 'InternalButton' &&
          !node.attributes.some(attr => attr.type === 'JSXAttribute' && attr.name.name === 'formAction') &&
          // Without complex type-checking, we can't be sure if the attribute was provided in the spread.
          // To reduce unnecessary eslint ignores and code noise, this plays it on the safe side.
          !node.attributes.some(prop => prop.type === 'JSXSpreadAttribute')
        ) {
          context.report({ node, messageId: 'no-internal-button-without-form-action' });
        }
      },
    };
  },
};
