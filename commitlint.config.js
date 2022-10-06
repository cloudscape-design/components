// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['fix', 'feat']],
    'scope-empty': [0],
    'header-max-length': [0],
    'subject-case': [2, 'always', 'sentence-case'],
  },
};
