// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import Popover, { PopoverProps } from '~components/popover';
import PopoverBody, { PopoverBodyProps } from '~components/popover/body';

const noop = () => {};

const sizeMap: Record<PopoverProps.Size, number> = {
  small: 210,
  medium: 310,
  large: 480,
};

const triggerPermutations = createPermutations<PopoverProps & { size: PopoverProps.Size }>([
  {
    size: ['small', 'medium', 'large'],
    children: [
      'Hello!',
      'Really long popover content with a lot of text that will probably overflow the popover trigger',
      'Reallylongpopovercontentwithalotoftextbutnospacesthatwillprobablyoverflowthepopovertrigger',
    ],
    wrapTriggerText: [true, false],
  },
]);

const bodyPermutations = createPermutations<PopoverBodyProps & { size: PopoverProps.Size }>([
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
    dismissAriaLabel: ['Close'],
    onDismiss: [noop],
    overflowVisible: ['both'],
  },
]);

export default function () {
  return (
    <article>
      <h1>Popover text wrapping</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={triggerPermutations}
          render={({ size, ...permutation }) => (
            <div
              style={{
                width: sizeMap[size],
                maxWidth: sizeMap[size],
              }}
            >
              <Popover {...permutation} />
            </div>
          )}
        />

        <PermutationsView
          permutations={bodyPermutations}
          render={({ size, ...permutation }) => (
            <div
              style={{
                width: sizeMap[size],
                maxWidth: sizeMap[size],
              }}
            >
              <PopoverBody {...permutation} />
            </div>
          )}
        />
      </ScreenshotArea>
    </article>
  );
}
