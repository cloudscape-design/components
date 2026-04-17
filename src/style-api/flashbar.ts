// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { focusOutlineVars } from './shared';
import { StyleAPI } from './types';

export const flashbarStyleDictionary = {
  classNames: {
    item: 'awsui-style-flashbar-root',
  },
};

const styleApi: StyleAPI = {
  variables: [],
  selectors: [
    {
      className: flashbarStyleDictionary.classNames.item,
      description: 'Root element of a single flash item.',
      attributes: [
        {
          name: 'data-type',
          description: 'The type of the flash item. One of: success, error, warning, info, in-progress.',
        },
      ],
    },
  ],
};

export default styleApi;
