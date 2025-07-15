// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Badge, { BadgeProps } from '~components/badge';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';

const permutations = createPermutations<BadgeProps>([
  {
    children: ['Border Styles'],
    style: [
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
          borderWidth: '4px',
        },
      },
      {
        root: {
          borderColor: 'green',
          borderRadius: '4px',
          borderWidth: '4px',
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
          color: 'yellow',
        },
      },
      {
        root: {
          background: 'orange',
          borderWidth: '0px',
          color: 'blue',
        },
      },
    ],
  },

  {
    children: ['Padding Styles'],
    style: [
      {
        root: {
          paddingBlock: '4px',
          paddingInline: '8px',
        },
      },
      {
        root: {
          paddingBlock: '8px',
          paddingInline: '12px',
        },
      },
      {
        root: {
          paddingBlock: '12px',
          paddingInline: '16px',
        },
      },
      {
        root: {
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
    <div style={{ padding: '20px' }}>
      <h1>Badge Style permutations</h1>
      <PermutationsView permutations={permutations} render={permutation => <Badge {...permutation} />} />
    </div>
  );
}
