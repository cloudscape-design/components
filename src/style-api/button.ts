// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { iconStyleDictionary } from './icon';
import { focusOutlineStyleDictionary } from './internal-focus-outline';
import { StyleAPI } from './types';

export const buttonStyleDictionary = {
  classNames: {
    root: 'awsui-style-button-root',
  },
};

const styleApi: StyleAPI = {
  variables: [
    { name: focusOutlineStyleDictionary.vars.color, description: 'Focus outline color' },
    { name: focusOutlineStyleDictionary.vars.width, description: 'Focus outline width' },
    { name: focusOutlineStyleDictionary.vars.offset, description: 'Focus outline distance from the focused element' },
    { name: focusOutlineStyleDictionary.vars.radius, description: 'Focus outline border radius' },
    { name: iconStyleDictionary.vars.color, description: 'Icon color' },
  ],
  selectors: [
    {
      className: buttonStyleDictionary.classNames.root,
      description: 'The root element which can be a button or an anchor depending on properties.',
      tags: ['button', 'a'],
      attributes: [
        {
          name: 'aria-disabled',
          description: 'Can be used to select disabled buttons or links. Do not use "disabled" attribute for that.',
        },
      ],
    },
  ],
};

export default styleApi;
