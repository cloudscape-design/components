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
  variables: [...focusOutlineVars, ...placeholderVars],
  selectors: [
    {
      className: inputStyleDictionary.classNames.root,
      description:
        'Root element of the input. Contains the semantic input element and optional leading and trailing icons.',
    },
    {
      className: inputStyleDictionary.classNames.input,
      tags: ['input'],
      description: 'The semantic input element.',
      attributes: [
        {
          name: 'aria-invalid',
          description:
            'Present when the input is in an invalid state.',
        },
      ],
    },
  ],
};

export default styleApi;
