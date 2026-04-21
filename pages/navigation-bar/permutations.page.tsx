// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Link from '~components/link';
import NavigationBar, { NavigationBarProps } from '~components/navigation-bar';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const contentFull = (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%' }}>
    <Link href="#" fontSize="heading-m" color="inverted">
      App
    </Link>
    <span style={{ flex: 1, textAlign: 'center' }}>Center</span>
    <span>End</span>
  </div>
);

const contentStartOnly = (
  <Link href="#" fontSize="heading-m" color="inverted">
    App
  </Link>
);

const permutations = createPermutations<NavigationBarProps>([
  {
    variant: ['primary', 'secondary'],
    placement: ['block-start', 'block-end'],
    content: [contentFull],
    ariaLabel: ['Navigation'],
  },
  { variant: ['primary', 'secondary'], content: [contentStartOnly, undefined], ariaLabel: ['Navigation'] },
  { variant: ['primary', 'secondary'], disablePadding: [true], content: [contentFull], ariaLabel: ['No padding'] },
  { variant: ['primary', 'secondary'], ariaLabel: ['Empty'] },
]);

export default function NavigationBarPermutations() {
  return (
    <article>
      <h1>NavigationBar permutations</h1>
      <ScreenshotArea>
        <PermutationsView permutations={permutations} render={permutation => <NavigationBar {...permutation} />} />
      </ScreenshotArea>
    </article>
  );
}
