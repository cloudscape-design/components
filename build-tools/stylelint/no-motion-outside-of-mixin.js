// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import stylelint from 'stylelint';

const ruleName = '@cloudscape-design/no-motion-outside-of-mixin';
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: property => `Property "${property}" should be directly under 'with-motion' helper`,
});

function findUpUntil(node, callback) {
  let current = node;
  while (current && !callback(current)) {
    current = current.parent;
  }
  return current;
}

function noMotionOutsideOfMixinPlugin() {
  return (root, result) => {
    root.walkDecls(/animation|transition/, decl => {
      // sass variables are okay, because they do not produce CSS
      if (decl.prop.startsWith('$')) {
        return;
      }
      const parent = decl.parent;
      const hasMotionMixin =
        parent.type === 'atrule' && parent.name === 'include' && parent.params.endsWith('with-motion');
      const isInKeyframes = findUpUntil(decl, node => node.type === 'atrule' && node.name === 'keyframes');

      if (!hasMotionMixin && !isInKeyframes) {
        stylelint.utils.report({
          result,
          ruleName,
          message: messages.rejected(decl.prop),
          node: decl,
        });
      }
    });
  };
}
noMotionOutsideOfMixinPlugin.ruleName = ruleName;
noMotionOutsideOfMixinPlugin.messages = messages;

export default stylelint.createPlugin(ruleName, noMotionOutsideOfMixinPlugin);
