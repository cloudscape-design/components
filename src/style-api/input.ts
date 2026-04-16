// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { focusOutlineStyleDictionary } from './internal-focus-outline';
import { StyleAPI } from './types';

export const inputStyleDictionary = {
  vars: {
    placeholderColor: '--awsui-style-input-placeholder-color',
    placeholderFont: '--awsui-style-input-placeholder-font',
    placeholderFontStyle: '--awsui-style-input-placeholder-font-style',
    placeholderFontWeight: '--awsui-style-input-placeholder-font-weight',
  },
  classNames: {
    root: 'awsui-style-input-root',
    input: 'awsui-style-input-input',
  },
};

const styleApi: StyleAPI = {
  variables: [
    { name: focusOutlineStyleDictionary.vars.color, description: 'Focus outline color' },
    { name: focusOutlineStyleDictionary.vars.width, description: 'Focus outline width' },
    { name: focusOutlineStyleDictionary.vars.offset, description: 'Focus outline distance from the focused element' },
    { name: focusOutlineStyleDictionary.vars.radius, description: 'Focus outline border radius' },
    { name: inputStyleDictionary.vars.placeholderColor, description: 'Color of the input placeholder' },
    { name: inputStyleDictionary.vars.placeholderFont, description: 'Font of the input placeholder' },
    { name: inputStyleDictionary.vars.placeholderFontStyle, description: 'Font style of the input placeholder' },
    { name: inputStyleDictionary.vars.placeholderFontWeight, description: 'Font weight of the input placeholder' },
  ],
  selectors: [
    {
      className: inputStyleDictionary.classNames.root,
      description:
        'The root element of the input that includes a semantic input and optional icons to the left and right.',
    },
    {
      className: inputStyleDictionary.classNames.input,
      tags: ['input'],
      description: 'The semantic input element.',
    },
  ],
};

export default styleApi;
