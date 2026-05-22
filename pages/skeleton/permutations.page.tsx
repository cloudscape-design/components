// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Skeleton, { SkeletonProps } from '~components/skeleton';

import { SimplePage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';

const permutations = createPermutations<SkeletonProps>([
  // Test all variants with default display and reasonable width
  {
    variant: [
      undefined,
      'dynamic',
      'text-body-s',
      'text-body-m',
      'text-heading-xs',
      'text-heading-s',
      'text-heading-m',
      'text-heading-l',
      'text-heading-xl',
      'text-display-l',
    ],
    width: [undefined, '200px'],
  },
  // Test display options with default variant
  {
    display: ['block', 'inline-block', 'inline'],
    width: [undefined, '150px'],
    height: [undefined, '2em'],
  },
  // Test height variations with default variant
  {
    height: ['50px', '100px', '2em'],
    width: [undefined, '200px'],
  },
  // Test variant combinations with custom dimensions
  {
    variant: ['text-body-m', 'text-heading-m', 'text-display-l'],
    height: ['100px'],
    width: ['250px'],
  },
]);

export default function SkeletonPermutations() {
  return (
    <SimplePage title="Skeleton permutations" screenshotArea={{ disableAnimations: true }}>
      <PermutationsView
        permutations={permutations}
        render={permutation => (
          <div style={{ marginBottom: '16px' }}>
            <Skeleton {...permutation} />
          </div>
        )}
      />
    </SimplePage>
  );
}
