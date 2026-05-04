// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Divider, { DividerProps } from '~components/divider';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<DividerProps>([
  // Horizontal — no label
  { semantic: [false, true] },
  // Horizontal — with label
  { children: ['And', 'This is a mucher longer section title'], semantic: [false, true] },
  // Horizontal — with ariaLabel
  { ariaLabel: ['Section separator'], semantic: [true] },
  // Vertical
  { orientation: ['vertical'], semantic: [false, true] },
]);

export default function DividerPermutations() {
  return (
    <>
      <h1>Divider permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation =>
            permutation.orientation === 'vertical' ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px', height: '48px' }}>
                <span>Left</span>
                <Divider {...permutation} />
                <span>Right</span>
              </div>
            ) : (
              <div style={{ maxWidth: '400px', padding: '16px' }}>
                <p>Above</p>
                <Divider {...permutation} />
                <p>Below</p>
              </div>
            )
          }
        />
      </ScreenshotArea>
    </>
  );
}
