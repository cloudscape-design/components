// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

const LEGACY_TOKEN_PATTERN = /\{color(Grey|Blue|Green|Red|Yellow)\d+\}/g;
const REFERENCE_TOKEN_SUGGESTIONS = {
  colorGrey: 'colorNeutral',
  colorBlue: 'colorPrimary or colorInfo',
  colorGreen: 'colorSuccess',
  colorRed: 'colorError',
  colorYellow: 'colorWarning',
};

module.exports = {
  meta: {
    type: 'problem',
    messages: {
      'no-legacy-tokens':
        'Direct palette token {{token}} is deprecated. Use reference tokens like {{suggestion}} instead.',
    },
    docs: {
      description: 'Prevents use of legacy color palette tokens in favor of semantic reference tokens.',
    },
    fixable: 'code',
  },
  create(context) {
    return {
      Literal(node) {
        if (typeof node.value === 'string') {
          const matches = node.value.match(LEGACY_TOKEN_PATTERN);
          if (matches) {
            matches.forEach(token => {
              const colorFamily = token.match(/color(Grey|Blue|Green|Red|Yellow)/)?.[1];
              const suggestion = REFERENCE_TOKEN_SUGGESTIONS[`color${colorFamily}`] || 'semantic reference tokens';

              context.report({
                node,
                messageId: 'no-legacy-tokens',
                data: { token, suggestion },
              });
            });
          }
        }
      },
      TemplateElement(node) {
        const matches = node.value.raw.match(LEGACY_TOKEN_PATTERN);
        if (matches) {
          matches.forEach(token => {
            const colorFamily = token.match(/color(Grey|Blue|Green|Red|Yellow)/)?.[1];
            const suggestion = REFERENCE_TOKEN_SUGGESTIONS[`color${colorFamily}`] || 'semantic reference tokens';

            context.report({
              node,
              messageId: 'no-legacy-tokens',
              data: { token, suggestion },
            });
          });
        }
      },
    };
  },
};
