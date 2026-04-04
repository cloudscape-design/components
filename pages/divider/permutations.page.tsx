// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Divider, { DividerProps } from '~components/divider';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<DividerProps>([
  {
    decorative: [true, false],
  },
]);

export default function DividerPermutations() {
  return (
    <>
      <h1>Divider permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <div style={{ width: '300px', padding: '16px' }}>
              <p>Above</p>
              <Divider {...permutation} />
              <p>Below</p>
            </div>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
