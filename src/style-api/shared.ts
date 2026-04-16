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
  { name: focusOutlineStyleDictionary.vars.color, description: 'Focus outline color' },
  { name: focusOutlineStyleDictionary.vars.width, description: 'Focus outline width' },
  { name: focusOutlineStyleDictionary.vars.offset, description: 'Focus outline distance from the focused element' },
  { name: focusOutlineStyleDictionary.vars.radius, description: 'Focus outline border radius' },
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
  { name: placeholderStyleDictionary.vars.placeholderColor, description: 'Color of the input placeholder' },
  { name: placeholderStyleDictionary.vars.placeholderFont, description: 'Font of the input placeholder' },
  { name: placeholderStyleDictionary.vars.placeholderFontStyle, description: 'Font style of the input placeholder' },
  { name: placeholderStyleDictionary.vars.placeholderFontWeight, description: 'Font weight of the input placeholder' },
];
