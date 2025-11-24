// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ExpandableSection, { ExpandableSectionProps } from '~components/expandable-section';
import Link from '~components/link';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<ExpandableSectionProps>([
  {
    variant: ['default', 'container', 'footer', 'inline', 'navigation'],
    headerText: ['Description with links'],
    children: ['Sample content'],
    headerDescription: [
      <>
        Sample description <Link href="#">with a link</Link> within a sentence.
      </>,
    ],
    defaultExpanded: [true],
  },
]);

export default function ExpandableSectionPermutations() {
  return (
    <>
      <h1>Expandable Section permutations with links in the description</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView permutations={permutations} render={permutation => <ExpandableSection {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
