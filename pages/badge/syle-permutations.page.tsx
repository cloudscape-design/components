// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Badge, { BadgeProps } from '~components/badge';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<BadgeProps>([
  {
    children: ['Border Styles'],
    style: [
      {
        root: {
          borderColor: 'black',
          borderRadius: '2px',
          borderWidth: '4px',
        },
      },
    ],
    //variant: ['grey', 'blue', 'critical', 'high', 'medium', 'low', 'neutral'],
  },
  {
    children: ['Background and Color Styles'],
    style: [
      {
        root: {
          background: 'purple',
          borderWidth: '0px',
          color: 'red',
        },
      },
    ],
    //variant: ['grey', 'blue', 'critical', 'high', 'medium', 'low', 'neutral'],
  },
  {
    children: ['Padding Styles'],
    style: [
      {
        root: {
          borderColor: 'blue',
          borderWidth: '2px',
          borderRadius: '1px',
          paddingBlock: '22px',
          paddingInline: '44px',
        },
      },
    ],
    //variant: ['grey', 'blue', 'critical', 'high', 'medium', 'low', 'neutral'],
  },
]);

export default function BadgeStylePermutations() {
  return (
    <>
      <h1>Badge Style permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView permutations={permutations} render={permutation => <Badge {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
