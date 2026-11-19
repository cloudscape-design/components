// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import DragHandle, { DragHandleProps } from '~components/internal/components/drag-handle';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<DragHandleProps>([
  {
    variant: ['drag-indicator', 'resize-area', 'resize-horizontal', 'resize-vertical'],
    ariaLabel: ['drag-handle'],
  },
  {
    variant: ['drag-indicator', 'resize-area', 'resize-horizontal', 'resize-vertical'],
    ariaLabel: ['drag-handle'],
    size: ['small'],
  },
  {
    variant: ['drag-indicator', 'resize-area', 'resize-horizontal', 'resize-vertical'],
    ariaLabel: ['drag-handle'],
    disabled: [true],
  },
]);

export default function DragHandlePermutations() {
  return (
    <>
      <h1>Drag handle permutations</h1>
      <ScreenshotArea style={{ maxWidth: 600 }}>
        <PermutationsView permutations={permutations} render={permutation => <DragHandle {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
