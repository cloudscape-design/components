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
          borderWidth: '1px',
        },
      },
      {
        root: {
          borderColor: 'red',
          borderRadius: '8px',
          borderWidth: '2px',
        },
      },
      {
        root: {
          borderColor: 'blue',
          borderRadius: '12px',
          borderWidth: '3px',
        },
      },
      {
        root: {
          borderColor: 'green',
          borderRadius: '99px',
          borderWidth: '1px',
        },
      },
    ],
    color: [
      'grey',
      'blue',
      'severity-critical',
      'severity-high',
      'severity-medium',
      'severity-low',
      'severity-neutral',
    ],
  },

  {
    children: ['Background and Color Styles'],
    style: [
      {
        root: {
          background: 'purple',
          borderWidth: '0px',
          color: 'white',
        },
      },
      {
        root: {
          background: 'green',
          borderWidth: '0px',
          color: 'white',
        },
      },
      {
        root: {
          background: 'orange',
          borderWidth: '0px',
          color: 'black',
        },
      },
      {
        root: {
          background: 'transparent',
          borderWidth: '2px',
          borderColor: 'red',
          color: 'red',
        },
      },
    ],
  },

  {
    children: ['Padding Styles'],
    style: [
      {
        root: {
          borderColor: 'blue',
          borderWidth: '10px',
          borderRadius: '10px',
          paddingBlock: '4px',
          paddingInline: '8px',
        },
      },
      {
        root: {
          borderColor: 'blue',
          borderWidth: '10px',
          borderRadius: '10px',
          paddingBlock: '8px',
          paddingInline: '12px',
        },
      },
      {
        root: {
          borderColor: 'blue',
          borderWidth: '10px',
          borderRadius: '10px',
          paddingBlock: '12px',
          paddingInline: '16px',
        },
      },
      {
        root: {
          borderColor: 'blue',
          borderWidth: '10px',
          borderRadius: '10px',
          paddingBlock: '16px',
          paddingInline: '24px',
        },
      },
    ],
    color: [
      'grey',
      'blue',
      'severity-critical',
      'severity-high',
      'severity-medium',
      'severity-low',
      'severity-neutral',
    ],
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
