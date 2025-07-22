// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Badge, { BadgeProps } from '~components/badge';

import createPermutations from './utils/permutations';
import PermutationsView from './utils/permutations-view';
import ScreenshotArea from './utils/screenshot-area';

const permutations = createPermutations<BadgeProps>([
  {
    color: [
      'blue',
      'grey',
      'green',
      'red',
      'severity-critical',
      'severity-high',
      'severity-medium',
      'severity-low',
      'severity-neutral',
    ],
    children: [
      'ABC',
      'Badge With A Very Long Text',
      <>
        Badge with <strong>html</strong>
      </>,
    ],
  },
]);

export default function BadgePermutations() {
  return (
    <>
      <h1>Badge permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView permutations={permutations} render={permutation => <Badge {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
