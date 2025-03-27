// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, SelectProps } from '~components';
import Trigger, { TriggerProps } from '~components/select/parts/trigger';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const complexOption: SelectProps.Option = {
  label: 'Complex option',
  labelTag: 'tag',
  description: 'description',
  iconName: 'share',
  tags: ['tag 1', 'tag 2', 'tag 3'],
  filteringTags: ['tag 1', 'tag 2'],
};
const longOption = {
  label:
    'Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label Label',
  labelTag:
    'LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag LabelTag',
  description:
    'Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description',
  tags: [
    'Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1 Tag1',
    'Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2 Tag2',
  ],
};

const complexOptionWithCustomSvg = {
  label: 'Complex option',
  labelTag: 'tag',
  description: 'description',
  iconSvg: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false">
      <circle cx="8" cy="8" r="7" />
      <circle cx="8" cy="8" r="3" />
    </svg>
  ),
  tags: ['tag 1', 'tag 2', 'tag 3'],
  filteringTags: ['tag 1', 'tag 2'],
};

const permutations = createPermutations<TriggerProps>([
  {
    placeholder: ['Select an item'],
    triggerVariant: ['label'],
    triggerProps: [{ ref: React.createRef() }],
    selectedOption: [null, complexOption],
    disabled: [false],
  },
  {
    placeholder: ['Select an item'],
    disabled: [true],
    triggerVariant: ['option'],
    triggerProps: [{ ref: React.createRef() }],
    selectedOption: [complexOption],
  },
  {
    placeholder: ['Select an item'],
    triggerVariant: ['label'],
    invalid: [true],
    triggerProps: [{ ref: React.createRef() }],
    selectedOption: [complexOption],
    isOpen: [false, true],
    disabled: [false],
  },
  {
    placeholder: ['Select an item'],
    triggerVariant: ['label'],
    warning: [true],
    triggerProps: [{ ref: React.createRef() }],
    selectedOption: [complexOption],
    isOpen: [false, true],
    disabled: [false],
  },
  {
    placeholder: ['Select an item'],
    triggerVariant: ['label'],
    warning: [true],
    invalid: [true],
    triggerProps: [{ ref: React.createRef() }],
    selectedOption: [complexOption],
    isOpen: [false],
    disabled: [false],
  },
  {
    placeholder: [
      'A very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long placeholder',
    ],
    disabled: [false],
    triggerVariant: ['label', 'option'],
    triggerProps: [{ ref: React.createRef() }],
    selectedOption: [null, longOption],
  },
  {
    placeholder: ['Select an item'],
    disabled: [true, false],
    triggerVariant: ['option'],
    triggerProps: [{ ref: React.createRef() }],
    selectedOption: [complexOptionWithCustomSvg],
  },
  {
    placeholder: ['Select an item'],
    disabled: [false, true],
    readOnly: [true],
    triggerVariant: ['label'],
    triggerProps: [{ ref: React.createRef() }],
    selectedOption: [complexOption, null],
  },
  // Inline label
  {
    placeholder: ['Select an item'],
    triggerProps: [{ ref: React.createRef() }],
    readOnly: [false],
    disabled: [false],
    triggerVariant: ['label', 'option'],
    selectedOption: [complexOption, null],
    inlineLabelText: [
      'Inline label',
      'Very long inline label that should wrap into multiple lines on narrow enough viewports',
    ],
  },
  // Inline label, read only
  {
    placeholder: ['Select an item'],
    triggerProps: [{ ref: React.createRef() }],
    readOnly: [true],
    disabled: [false],
    triggerVariant: ['label', 'option'],
    selectedOption: [complexOption, null],
    inlineLabelText: [
      'Inline label',
      'Very long inline label that should wrap into multiple lines on narrow enough viewports',
    ],
  },
  // Inline label, disabled
  {
    placeholder: ['Select an item'],
    triggerProps: [{ ref: React.createRef() }],
    readOnly: [false],
    disabled: [true],
    triggerVariant: ['label', 'option'],
    selectedOption: [complexOption, null],
    inlineLabelText: [
      'Inline label',
      'Very long inline label that should wrap into multiple lines on narrow enough viewports',
    ],
  },
]);

export default function InputPermutations() {
  return (
    <Box>
      <h1>Select trigger permutations</h1>
      <ScreenshotArea>
        <PermutationsView permutations={permutations} render={permutation => <Trigger {...permutation} />} />
      </ScreenshotArea>
    </Box>
  );
}
