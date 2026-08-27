// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import Dialog from '~components/dialog';
import { DialogProps } from '~components/dialog/interfaces';
import SpaceBetween from '~components/space-between';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const footer = (
  <SpaceBetween direction="horizontal" size="xs">
    <Button>Skip</Button>
    <Button variant="primary">Continue</Button>
  </SpaceBetween>
);

// The close button is always present, so it is not a permutation axis.
const permutations = createPermutations<DialogProps>([
  // Header + content + footer
  {
    onDismiss: [() => {}],
    i18nStrings: [{ dismissAriaLabel: 'Close' }],
    header: ['What’s your main goal?'],
    children: ['Choose the option that best matches your intent.'],
    footer: [footer],
  },
  // Header + content only (no footer)
  {
    onDismiss: [() => {}],
    i18nStrings: [{ dismissAriaLabel: 'Close' }],
    header: ['Authorize account access'],
    children: ['Read and write access will be granted to the deployment agent.'],
  },
  // Long content to check wrapping/scroll behavior
  {
    onDismiss: [() => {}],
    i18nStrings: [{ dismissAriaLabel: 'Close' }],
    header: ['Tell us what went wrong'],
    children: [
      'This is a longer body of content used to verify that the dialog grows with its content and that the header, content, and footer regions remain visually distinct across a taller layout.',
    ],
    footer: [footer],
  },
]);

export default function DialogPermutationsPage() {
  return (
    <>
      <h1>Dialog permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <div style={{ maxInlineSize: 520 }}>
          <PermutationsView permutations={permutations} render={permutation => <Dialog {...permutation} />} />
        </div>
      </ScreenshotArea>
    </>
  );
}
