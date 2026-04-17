// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { iconStyleDictionary } from './icon';
import { focusOutlineVars } from './shared';
import { StyleAPI } from './types';

export const collectionPreferencesStyleDictionary = {
  classNames: {
    root: 'awsui-style-collection-preferences-root',
    trigger: 'awsui-style-collection-preferences-trigger',
  },
};

const styleApi: StyleAPI = {
  variables: [...focusOutlineVars, { name: iconStyleDictionary.vars.color, description: 'Color of the icon.' }],
  selectors: [
    {
      className: collectionPreferencesStyleDictionary.classNames.root,
      description: 'Root element of the collection preferences component.',
    },
    {
      className: collectionPreferencesStyleDictionary.classNames.trigger,
      description: 'Collection preferences trigger that opens the preferences modal.',
      tags: ['button'],
    },
  ],
};

export default styleApi;
