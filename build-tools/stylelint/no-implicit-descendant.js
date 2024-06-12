// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import stylelint from 'stylelint';

const ruleName = '@cloudscape-design/no-implicit-descendant';
const messages = stylelint.utils.ruleMessages(ruleName, {
  rejected: (parentSelector, selectors) => {
    return `Avoid nesting without a combinator at ${parentSelector} → ${selectors.join(', ')}`;
  },
});

const defaultOptions = {
  ignoreParents: [],
};

const removeLeadingCombinators = selector => selector.replace(/^[>+~]\s+/, '');

const getContainerName = container => {
  if (container.type === 'rule') {
    return container.selector;
  } else if (container.type === 'atrule') {
    return `@${container.name}`;
  } else {
    throw new Error(`Unexpected container type "${container.type}"`);
  }
};

function noImplicitDescendantPlugin(enabled, { ignoreParents } = defaultOptions) {
  if (!enabled) {
    return;
  }

  return (root, result) => {
    root.walkRules(function (rule) {
      const parent = rule.parent;

      // CSS scoping is not a concern for certain elements (like SVGs).
      if (
        parent.type === 'rule' &&
        parent.selectors.every(parentSelector => ignoreParents.includes(removeLeadingCombinators(parentSelector)))
      ) {
        return;
      }

      // We have to check at-rules because SCSS lets us nest at-rules inside other rules.
      // Top level at-rules are fine, except for @mixin and @include because their actual location is unknown to the parser.
      if (
        parent.type === 'atrule' &&
        (ignoreParents.includes(`@${parent.name}`) ||
          (parent.parent.type === 'root' && parent.name !== 'mixin' && parent.name !== 'include'))
      ) {
        return;
      }

      // Non-nested and space-separated selectors are already covered by the
      // "selector-combinator-disallowed-list" rule.
      if (parent.type !== 'root') {
        // Combine comma-separated selectors to reduce output noise.
        const failingSelectors = rule.selectors.filter(
          selector => !selector.match(/^[>+~]/) && !selector.includes('&')
        );

        if (failingSelectors.length > 0) {
          stylelint.utils.report({
            result,
            ruleName,
            message: messages.rejected(getContainerName(parent), failingSelectors),
            node: rule,
          });
        }
      }
    });
  };
}
noImplicitDescendantPlugin.ruleName = ruleName;
noImplicitDescendantPlugin.messages = messages;

export default stylelint.createPlugin(ruleName, noImplicitDescendantPlugin);
