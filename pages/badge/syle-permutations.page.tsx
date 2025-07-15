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
          borderStyle: 'solid',
        },
      },
      {
        root: {
          borderColor: 'blue',
          borderRadius: '12px',
          borderWidth: '4px',
          borderStyle: 'dashed',
        },
      },
      {
        root: {
          borderColor: 'green',
          borderRadius: '4px',
          borderWidth: '4px',
          borderStyle: 'solid',
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
    children: ['Background Styles'],
    style: [
      {
        root: {
          background: 'purple',
          borderWidth: '0px',
        },
      },
      {
        root: {
          background: 'green',
          borderWidth: '0px',
        },
      },
      {
        root: {
          background: 'orange',
          borderWidth: '0px',
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
    children: ['Padding Styles'],
    style: [
      {
        root: {
          borderRadius: '8px',
          paddingBlock: '4px',
          paddingInline: '8px',
        },
      },
      {
        root: {
          borderRadius: '8px',
          paddingBlock: '8px',
          paddingInline: '12px',
        },
      },
      {
        root: {
          borderRadius: '8px',
          paddingBlock: '12px',
          paddingInline: '16px',
        },
      },
      {
        root: {
          borderRadius: '8px',
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
