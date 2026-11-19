// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import { StyleDictionary } from '../../utils/interfaces.js';

const metadata: StyleDictionary.MetadataIndex = {
  sizeVerticalInput: {
    description:
      'The height of form input components. For example: input, select, multiselect, autosuggest, and datepicker.',
    public: true,
    themeable: true,
  },
  sizeSideNavigationItemHeight: {
    description: 'The minimum height of side navigation items.',
    public: true,
    themeable: true,
  },
  sizeSideNavigationItemCollapsed: {
    description: 'The square size of collapsed side navigation items.',
    public: true,
    themeable: true,
  },
  sizeSideNavigationCollapsedWidth: {
    description: 'The default width of the collapsed side navigation rail.',
    public: true,
    themeable: true,
  },
};

export default metadata;
