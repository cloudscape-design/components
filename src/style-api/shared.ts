// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { StyleAPIVariable } from './types';

export const focusOutlineStyleDictionary = {
  vars: {
    color: '--awsui-style-focus-outline-color',
    width: '--awsui-style-focus-outline-width',
    offset: '--awsui-style-focus-outline-offset',
    radius: '--awsui-style-focus-outline-radius',
  },
};

export const focusOutlineVars: readonly StyleAPIVariable[] = [
  { name: focusOutlineStyleDictionary.vars.color, description: 'Color of the focus outline.' },
  { name: focusOutlineStyleDictionary.vars.width, description: 'Width of the focus outline.' },
  {
    name: focusOutlineStyleDictionary.vars.offset,
    description: 'Gap between the focused element and the focus outline.',
  },
  { name: focusOutlineStyleDictionary.vars.radius, description: 'Border radius of the focus outline.' },
];

export const placeholderStyleDictionary = {
  vars: {
    placeholderColor: '--awsui-style-input-placeholder-color',
    placeholderFont: '--awsui-style-input-placeholder-font',
    placeholderFontStyle: '--awsui-style-input-placeholder-font-style',
    placeholderFontWeight: '--awsui-style-input-placeholder-font-weight',
  },
};

export const placeholderVars: readonly StyleAPIVariable[] = [
  { name: placeholderStyleDictionary.vars.placeholderColor, description: 'Color of the placeholder text.' },
  { name: placeholderStyleDictionary.vars.placeholderFont, description: 'Font shorthand for the placeholder text.' },
  { name: placeholderStyleDictionary.vars.placeholderFontStyle, description: 'Font style of the placeholder text.' },
  { name: placeholderStyleDictionary.vars.placeholderFontWeight, description: 'Font weight of the placeholder text.' },
];
