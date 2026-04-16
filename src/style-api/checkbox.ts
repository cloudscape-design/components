// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { focusOutlineStyleDictionary } from './internal-focus-outline';
import { StyleAPI } from './types';

export const checkboxStyleDictionary = {
  vars: {
    fillColor: '--awsui-style-checkbox-fill-color',
    markColor: '--awsui-style-checkbox-mark-color',
  },
  classNames: {
    root: 'awsui-style-checkbox-root',
    label: 'awsui-style-checkbox-label',
  },
};

const styleApi: StyleAPI = {
  variables: [
    { name: focusOutlineStyleDictionary.vars.color, description: 'Focus outline color' },
    { name: focusOutlineStyleDictionary.vars.width, description: 'Focus outline width' },
    { name: focusOutlineStyleDictionary.vars.offset, description: 'Focus outline distance from the focused element' },
    { name: focusOutlineStyleDictionary.vars.radius, description: 'Focus outline border radius' },
    { name: checkboxStyleDictionary.vars.fillColor, description: 'Color of the checkbox rect background' },
    { name: checkboxStyleDictionary.vars.markColor, description: 'Color of the checkbox mark' },
  ],
  selectors: [
    {
      className: checkboxStyleDictionary.classNames.root,
      description:
        'The root element of the checkbox that includes invisible semantic input and visible checkbox SVG and label.',
      attributes: [
        { name: 'data-checked', description: 'Use it to assert if the checkbox is checked.' },
        { name: 'data-indeterminate', description: 'Use it to assert if the checkbox is indeterminate.' },
        { name: 'data-disabled', description: 'Use it to assert if the checkbox is disabled.' },
      ],
    },
    {
      className: checkboxStyleDictionary.classNames.label,
      description: 'Checkbox selector, rendered next to checkbox SVG element.',
    },
  ],
};

export default styleApi;
