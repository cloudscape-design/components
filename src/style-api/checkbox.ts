// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { focusOutlineVars } from './shared';
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
    ...focusOutlineVars,
    { name: checkboxStyleDictionary.vars.fillColor, description: 'Background color of the checkbox.' },
    {
      name: checkboxStyleDictionary.vars.markColor,
      description: 'Color of the checkmark or indeterminate mark inside the checkbox.',
    },
  ],
  selectors: [
    {
      className: checkboxStyleDictionary.classNames.root,
      description:
        'Root element of the checkbox. Contains the hidden semantic input, the visible checkbox SVG, and the label.',
      attributes: [
        { name: 'data-checked', description: 'Present when the checkbox is checked.' },
        { name: 'data-indeterminate', description: 'Present when the checkbox is in an indeterminate state.' },
        { name: 'data-disabled', description: 'Present when the checkbox is disabled.' },
      ],
    },
    {
      className: checkboxStyleDictionary.classNames.label,
      description: 'Label element rendered next to the checkbox SVG.',
    },
  ],
};

export default styleApi;
