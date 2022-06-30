// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import PopoverBody, { PopoverBodyProps } from '~components/popover/body';

const noop = () => {};

/* eslint-disable react/jsx-key */
const permutations = createPermutations<PopoverBodyProps>([
  {
    size: ['small', 'medium', 'large'],
    header: [
      undefined,
      'Header',
      'Really long header with a lot of text that will probably overflow the popover body',
      'Reallylongheaderwithalotoftextbutnospacesthatwillprobablyoverflowthepopoverbody',
    ],
    children: [
      undefined,
      'Hello!',
      'Really long popover content with a lot of text that will probably overflow the popover body',
      'Reallylongpopovercontentwithalotoftextbutnospacesthatwillprobablyoverflowthepopoverbody',
    ],
    // "true" can't be tested here because the rendered popovers would all try
    // to lock focus and break navigation and a11y checks.
    dismissButton: [false],
    // Required internal properties
    fixedWidth: [true],
    dismissAriaLabel: ['Close'],
    onDismiss: [noop],
    overflowVisible: ['both'],
  },
]);
/* eslint-enable react/jsx-key */

export default function () {
  return (
    <article>
      <h1>Popover text wrapping</h1>
      <ScreenshotArea>
        <PermutationsView permutations={permutations} render={permutation => <PopoverBody {...permutation} />} />
      </ScreenshotArea>
    </article>
  );
}
