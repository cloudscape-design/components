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
        'The root element of the input that includes a semantic input and optional icons to the left and right.',
    },
    {
      className: inputStyleDictionary.classNames.input,
      tags: ['input'],
      description: 'The semantic input element.',
    },
  ],
};

export default styleApi;
