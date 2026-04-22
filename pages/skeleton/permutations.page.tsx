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
            </div>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
