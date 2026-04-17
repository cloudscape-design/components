// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { iconVars } from './icon';
import { focusOutlineVars } from './shared';
import { StyleAPI } from './types';

export const buttonStyleDictionary = {
  classNames: {
    root: 'awsui-style-button-root',
  },
};

const styleApi: StyleAPI = {
  variables: [],
  selectors: [
    {
      className: buttonStyleDictionary.classNames.root,
      description:
        'Root element of the button. Renders as a `<button>` or `<a>` depending on the component properties.',
      tags: ['button', 'a'],
      attributes: [
        {
          name: 'aria-disabled',
          description:
            'Present when the button is disabled. Prefer this over the "disabled" attribute when targeting disabled buttons or links.',
        },
      ],
      variables: [...focusOutlineVars, ...iconVars],
    },
  ],
};

export default styleApi;
