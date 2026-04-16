// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

interface StyleAPI {
  variables: readonly StyleAPIVariable[];
  selectors: readonly StyleAPISelector[];
}

interface StyleAPIVariable {
  name: string;
  description?: string;
}

interface StyleAPISelector {
  className: string;
  tags?: string[];
  description?: string;
  attributes?: readonly StyleAPIAttribute[];
}

interface StyleAPIAttribute {
  name: string;
  description?: string;
}

export const focusOutlineStyleDictionary = {
  vars: {
    color: '--awsui-style-focus-outline-color',
    width: '--awsui-style-focus-outline-width',
    offset: '--awsui-style-focus-outline-offset',
    radius: '--awsui-style-focus-outline-radius',
  },
};

export const iconStyleDictionary = {
  vars: {
    color: '--awsui-style-icon-color',
  },
};

export const buttonStyleDictionary = {
  classNames: {
    root: 'awsui-style-button-root',
    icon: 'awsui-style-button-icon',
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
