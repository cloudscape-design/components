// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { typographyVars } from './shared';
import { StyleAPI } from './types';

export const headerStyleDictionary = {
  classNames: {
    text: 'awsui-style-header-text',
    counter: 'awsui-style-header-counter',
  },
};

const styleApi: StyleAPI = {
  variables: [],
  selectors: [
    {
      className: headerStyleDictionary.classNames.text,
      description: 'The header text element.',
      variables: [...typographyVars],
    },
    {
      className: headerStyleDictionary.classNames.counter,
      description: 'The header counter element.',
      variables: [...typographyVars],
    },
  ],
};

export default styleApi;
