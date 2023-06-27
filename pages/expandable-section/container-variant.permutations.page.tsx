// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ExpandableSection, { ExpandableSectionProps } from '~components/expandable-section';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';
import Link from '~components/link';
import Button from '~components/button';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';

const permutations = createPermutations<ExpandableSectionProps>([
  {
    headerCounter: [undefined, '(5)'],
    headerDescription: [undefined, 'Expandable section header description'],
    // eslint-disable-next-line react/jsx-key
    headerInfo: [undefined, <Link variant="info">info</Link>],
    headerActions: [
      undefined,
      // eslint-disable-next-line react/jsx-key
      <SpaceBetween direction="horizontal" size="xs">
        <Button>Action</Button>
        <Button>Another action</Button>
      </SpaceBetween>,
    ],
  },
]);
export default function ExpandableSectionContainerVariantPermutations({
  variant = 'container',
}: {
  variant: ExpandableSectionProps.Variant;
}) {
  return (
    <article>
      <h1>Expandable Section - container variant</h1>

      <button id="focus-target">Focus target</button>

      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <ExpandableSection
              {...permutation}
              headerText={'Expandable section heading'}
              defaultExpanded={true}
              variant={variant}
            >
              Expandable section content
            </ExpandableSection>
          )}
        />
      </ScreenshotArea>
    </article>
  );
}
