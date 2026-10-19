// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { CopyToClipboard, CopyToClipboardProps, Popover } from '~components';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const FAIL_MARKER = 'FAIL';
if (typeof navigator !== 'undefined' && navigator.clipboard) {
  const originalWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);
  navigator.clipboard.writeText = (text: string) =>
    text.includes(FAIL_MARKER) ? Promise.reject(new Error('Copy failed')) : originalWriteText(text);
}

const permutations = createPermutations<CopyToClipboardProps>([
  {
    variant: ['inline', 'icon', 'button'],
    disabled: [true, false],
    disabledReason: ['Copying is disabled'],
    textToCopy: [
      'Lorem ipsum dolor sit amet consectetur adipiscing elit cursus ut pharetra semper litora lobortis sed lacinia. Dolor mauris commodo accumsan aliquam litora phasellus interdum pulvinar rhoncus potenti sapien morbi inceptos suspendisse urna sem arcu imperdiet vivamus ipsum porta a lacinia vulputate elementum libero. Hac nostra fames vitae egestas sodales penatibus porta taciti habitant sociosqu ut ipsum quam adipiscing ligula sagittis id nec eleifend integer vulputate aptent felis.',
    ],
    copySuccessText: ['Text copied successfully'],
    textToDisplay: ['Lorem ipsum dolor sit amet consectetur adipiscing elit'],
    copyErrorText: ['Copy failed.'],
    copyButtonText: ['Copy to clipboard'],
  },
  {
    // Disabled without a disabledReason: the button is plainly disabled, is not
    // focusable, and shows no reason tooltip (unlike the disabled + reason group above).
    variant: ['inline', 'icon', 'button'],
    disabled: [true],
    textToCopy: ['Lorem ipsum dolor sit amet.'],
    copySuccessText: ['Text copied successfully'],
    textToDisplay: ['Lorem ipsum dolor sit amet consectetur adipiscing elit'],
    copyErrorText: ['Copy failed.'],
    copyButtonText: ['Copy to clipboard'],
  },
  {
    variant: ['inline', 'icon', 'button'],
    disabled: [false],
    textToCopy: ['FAIL: this text cannot be copied'],
    copySuccessText: ['Text copied successfully'],
    textToDisplay: ['Lorem ipsum dolor sit amet consectetur adipiscing elit'],
    copyErrorText: ['Failed to copy'],
    copyButtonText: ['Copy to clipboard'],
  },
  {
    textToDisplay: [
      <Popover key={1} content="Popover" triggerType="text">
        Inline block popover
      </Popover>,
      <Popover key={2} content="Popover" triggerType="text-inline">
        Inline text popover
      </Popover>,
    ],
    disabled: [false, true],
    variant: ['inline'],
    copyButtonText: ['Copy to clipboard'],
    textToCopy: ['Lorem ipsum dolor sit amet.'],
    copySuccessText: ['Text copied successfully'],
    copyErrorText: ['Copy failed.'],
  },
  {
    wrapText: [true, false],
    variant: ['inline'],
    textToCopy: [
      'Lorem ipsum dolor sit amet consectetur adipiscing elit cursus ut pharetra semper litora lobortis sed lacinia.',
    ],
    copyButtonText: ['Copy to clipboard'],
    copySuccessText: ['Text copied successfully'],
    copyErrorText: ['Copy failed.'],
  },
  {
    wrapText: [true, false],
    variant: ['inline'],
    textToDisplay: [
      <Popover key={1} content="Popover" wrapTriggerText={false}>
        Inline block popover with relatively long content that should truncate when wrapText is false
      </Popover>,
    ],
    textToCopy: ['Lorem ipsum dolor sit amet.'],
    copyButtonText: ['Copy to clipboard'],
    copySuccessText: ['Text copied successfully'],
    copyErrorText: ['Copy failed.'],
  },
]);

export default function ButtonPermutations() {
  return (
    <>
      <h1>Button permutations</h1>
      <ScreenshotArea disableAnimations={true} style={{ maxWidth: 400 }}>
        <PermutationsView permutations={permutations} render={permutation => <CopyToClipboard {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
