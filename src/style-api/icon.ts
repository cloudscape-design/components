// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { StyleAPI } from './types';

export const iconStyleDictionary = {
  vars: {
    color: '--awsui-style-icon-color',
  },
};

const styleApi: StyleAPI = {
  variables: [{ name: iconStyleDictionary.vars.color, description: 'Color of the icon.' }],
  selectors: [],
};

export const iconVars = [{ name: iconStyleDictionary.vars.color, description: 'Color of the icon.' }];

export default styleApi;
