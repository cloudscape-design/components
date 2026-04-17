// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { iconVars } from './icon';
import { focusOutlineVars } from './shared';
import { StyleAPI } from './types';

export const collectionPreferencesStyleDictionary = {
  classNames: {
    root: 'awsui-style-collection-preferences-root',
    trigger: 'awsui-style-collection-preferences-trigger',
  },
};

const styleApi: StyleAPI = {
  variables: [],
  selectors: [
    {
      className: collectionPreferencesStyleDictionary.classNames.trigger,
      description: 'Collection preferences trigger that opens the preferences modal.',
      tags: ['button'],
      variables: [...focusOutlineVars, ...iconVars],
    },
  ],
};

export default styleApi;
