// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { focusOutlineVars, placeholderVars } from './shared';
import { StyleAPI } from './types';

export const inputStyleDictionary = {
  classNames: {
    root: 'awsui-style-input-root',
    input: 'awsui-style-input-input',
  },
};

const styleApi: StyleAPI = {
  variables: [],
  selectors: [
    {
      className: inputStyleDictionary.classNames.input,
      tags: ['input'],
      description: 'The semantic input element.',
      attributes: [
        {
          name: 'aria-invalid',
          description: 'Present when the input is in an invalid state.',
        },
      ],
      variables: [...focusOutlineVars, ...placeholderVars],
    },
  ],
};

export default styleApi;
