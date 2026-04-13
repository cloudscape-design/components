// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Link from '~components/link';
import NavigationBar, { NavigationBarProps } from '~components/navigation-bar';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const start = (
  <Link href="#" fontSize="heading-m" color="inverted">
    App
  </Link>
);
const center = <span>Center content</span>;
const end = <span>End content</span>;

const permutations = createPermutations<NavigationBarProps>([
  // Variant × placement (horizontal)
  {
    variant: ['primary', 'secondary'],
    placement: ['block-start', 'block-end'],
    startContent: [start],
    endContent: [end],
    ariaLabel: ['Navigation'],
  },
  // All three slots
  {
    variant: ['primary', 'secondary'],
    startContent: [start],
    centerContent: [center],
    endContent: [end],
    ariaLabel: ['Navigation'],
  },
  // Slot combinations
  {
    startContent: [start, undefined],
    centerContent: [center, undefined],
    endContent: [end, undefined],
    ariaLabel: ['Navigation'],
  },
  // Empty bar
  {
    variant: ['primary', 'secondary'],
    ariaLabel: ['Empty'],
  },
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
