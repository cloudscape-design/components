// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Popover, { PopoverProps } from '~components/popover';

import FocusTarget from '../common/focus-target';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { longTriggerTextWithoutSpaces, longTriggerTextWithSpaces, shortText } from './common';

const triggerPermutations = createPermutations<PopoverProps>([
  {
    children: [shortText, longTriggerTextWithSpaces, longTriggerTextWithoutSpaces],
    wrapTriggerText: [true, false],
    triggerType: ['text', 'text-inline'],
  },
]);

export default function () {
  return (
    <article>
      <h1>Popover trigger focus ring</h1>
      <FocusTarget />
      <ScreenshotArea>
        <PermutationsView
          permutations={triggerPermutations}
          render={permutation => (
            <div
              style={{
                width: 210, // Narrow wrapping div to let the popover trigger text wrap or overflow when it's long
              }}
            >
              <Popover {...permutation} />
            </div>
          )}
        />
      </ScreenshotArea>
    </article>
  );
}
