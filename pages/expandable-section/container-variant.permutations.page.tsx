// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ExpandableSection, { ExpandableSectionProps } from '~components/expandable-section';

import ScreenshotArea from '../utils/screenshot-area';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import { headerActions, headerInfo } from './common';

const permutations = createPermutations<ExpandableSectionProps>([
  {
    headerCounter: [undefined, '(5)'],
    headerDescription: [
      undefined,
      'Expandable section header description',
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
    headerInfo: [undefined, headerInfo],
    headerActions: [undefined, headerActions],
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
