// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { iconVars } from './icon';
import { focusOutlineVars } from './shared';
import { StyleAPI } from './types';

export const paginationStyleDictionary = {
  classNames: {
    root: 'awsui-style-pagination-root',
    button: 'awsui-style-pagination-button',
  },
};

const styleApi: StyleAPI = {
  variables: [],
  selectors: [
    {
      className: paginationStyleDictionary.classNames.button,
      description: 'Pagination button (with page number or arrow).',
      tags: ['button'],
      variables: [...focusOutlineVars, ...iconVars],
    },
  ],
};

export default styleApi;
