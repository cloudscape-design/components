// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { iconVars } from './icon';
import { focusOutlineVars } from './shared';
import { StyleAPI } from './types';

export const breadcrumbStyleDictionary = {
  classNames: {
    pageLink: 'awsui-style-breadcrumb-page-link',
    activePageLabel: 'awsui-style-breadcrumb-side-active-page-text',
    dividerIcon: 'awsui-style-breadcrumb-divider-icon',
  },
};

const styleApi: StyleAPI = {
  variables: [],
  selectors: [
    {
      className: breadcrumbStyleDictionary.classNames.pageLink,
      description: 'Breadcrumb group interactive page link.',
      tags: ['a'],
      variables: [...focusOutlineVars, ...iconVars],
    },
    {
      className: breadcrumbStyleDictionary.classNames.activePageLabel,
      description: 'Breadcrumb group active page label element.',
    },
    {
      className: breadcrumbStyleDictionary.classNames.dividerIcon,
      description: 'Breadcrumb group divider icon. Use it in combination with Icon component styles.',
    },
  ],
};

export default styleApi;
