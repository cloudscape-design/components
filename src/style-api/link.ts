// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { iconVars } from './icon';
import { focusOutlineVars } from './shared';
import { StyleAPI } from './types';

export const linkStyleDictionary = {
  classNames: {
    root: 'awsui-style-link-root',
  },
};

const styleApi: StyleAPI = {
  variables: [],
  selectors: [
    {
      className: linkStyleDictionary.classNames.root,
      description: 'Root element of the link that renders as `<a>`.',
      tags: ['a'],
      variables: [...focusOutlineVars, ...iconVars],
    },
  ],
};

export default styleApi;
