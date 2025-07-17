// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import FileInput, { FileInputProps } from '~components/file-input';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<FileInputProps>([
  {
    value: [[]],
    onChange: [() => {}],
    ariaLabel: ['prompt file input'],
    variant: ['icon', 'button'],
    children: ['Upload file'],
    disabled: [false, true],
  },
  {
    value: [[]],
    onChange: [() => {}],
    ariaLabel: ['prompt file input'],
    variant: ['icon', 'button'],
    children: ['Upload file'],
    disabled: [true],
    disabledReason: ["You don't have access to upload files."],
  },
]);

export default function ExpandableSectionPermutations() {
  return (
    <>
      <h1>File input permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView permutations={permutations} render={permutation => <FileInput {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
