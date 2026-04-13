// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Skeleton, { SkeletonProps } from '~components/skeleton';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<SkeletonProps>([
  {
    height: [undefined, '50px', '100px', '2em'],
    width: [undefined, '100px', '200px', '50%', '100%'],
  },
  {
    height: ['80px'],
    width: ['300px'],
    style: [
      undefined,
      { root: { borderRadius: '8px' } },
      { root: { borderRadius: '50%' } },
      { root: { background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)' } },
    ],
  },
]);

export default function SkeletonPermutations() {
  return (
    <>
      <h1>Skeleton permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <div style={{ marginBottom: '16px' }}>
              <Skeleton {...permutation} />
              <div style={{ fontSize: '12px', marginTop: '4px', color: '#666' }}>
                height={permutation.height || 'default'} width={permutation.width || 'default'}
                {permutation.style && ' (custom style)'}
              </div>
            </div>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
