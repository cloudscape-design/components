// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { iconStyleDictionary } from './icon';
import { focusOutlineVars } from './shared';
import { StyleAPI } from './types';

export const paginationStyleDictionary = {
  classNames: {
    root: 'awsui-style-pagination-root',
    button: 'awsui-style-pagination-button',
  },
};

const styleApi: StyleAPI = {
  variables: [...focusOutlineVars, { name: iconStyleDictionary.vars.color, description: 'Color of the icon.' }],
  selectors: [
    {
      className: paginationStyleDictionary.classNames.root,
      description: 'Root element of the pagination component.',
    },
    {
      className: paginationStyleDictionary.classNames.button,
      description: 'Pagination button (with page number or arrow).',
      tags: ['button'],
    },
  ],
};

export default styleApi;
