// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { iconVars } from './icon';
import { focusOutlineVars } from './shared';
import { StyleAPI } from './types';

export const buttonDropdownStyleDictionary = {
  classNames: {
    root: 'awsui-style-button-dropdown-root',
    mainAction: 'awsui-style-button-dropdown-main-action',
    trigger: 'awsui-style-button-dropdown-trigger',
    dropdown: 'awsui-style-button-dropdown-dropdown',
    dropdownOption: 'awsui-style-button-dropdown-dropdown-option',
    dropdownGroup: 'awsui-style-button-dropdown-dropdown-group',
    dropdownExpandableGroup: 'awsui-style-button-dropdown-dropdown-expandable-group',
  },
};

const styleApi: StyleAPI = {
  variables: [],
  selectors: [
    {
      className: buttonDropdownStyleDictionary.classNames.mainAction,
      description: 'Main action button.',
      tags: ['button'],
      variables: [...focusOutlineVars, ...iconVars],
    },
    {
      className: buttonDropdownStyleDictionary.classNames.trigger,
      description: 'Trigger button that opens the dropdown menu.',
      tags: ['button'],
      variables: [...focusOutlineVars, ...iconVars],
    },
    {
      className: buttonDropdownStyleDictionary.classNames.dropdown,
      description:
        'Dropdown element that includes options and groups. When component is used with `expandToViewport`, the dropdown is rendered in a portal and thus will not be nested under the root element. Use `referrerClassName` to attached a custom class to the dropdown in this case.',
    },
    {
      className: buttonDropdownStyleDictionary.classNames.dropdownOption,
      description: 'Dropdown menu option.',
      tags: ['li'],
    },
    {
      className: buttonDropdownStyleDictionary.classNames.dropdownGroup,
      description: 'Dropdown menu group.',
      tags: ['ul'],
    },
    {
      className: buttonDropdownStyleDictionary.classNames.dropdownExpandableGroup,
      description: 'Interactive dropdown menu group.',
      tags: ['ul'],
    },
  ],
};

export default styleApi;
