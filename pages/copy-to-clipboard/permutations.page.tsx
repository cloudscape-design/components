// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { CopyToClipboard, CopyToClipboardProps, Popover } from '~components';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

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
]);

export default function ButtonPermutations() {
  return (
    <>
      <h1>Button permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView permutations={permutations} render={permutation => <CopyToClipboard {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
