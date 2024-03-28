// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Trigger from '~components/select/parts/trigger';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const complexOption = {
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

const permutations = createPermutations<any>([
  {
    placeholder: ['Select an item'],
    triggerVariant: ['label'],
    triggerProps: [{}],
    selectedOption: [null, complexOption],
  },
  {
    placeholder: ['Select an item'],
    disabled: [true],
    triggerVariant: ['option'],
    triggerProps: [{}],
    selectedOption: [complexOption],
  },
  {
    placeholder: ['Select an item'],
    triggerVariant: ['label'],
    invalid: [true],
    triggerProps: [{}],
    selectedOption: [complexOption],
    isOpen: [false, true],
  },
  {
    placeholder: ['Select an item'],
    triggerVariant: ['label'],
    warning: [true],
    triggerProps: [{}],
    selectedOption: [complexOption],
    isOpen: [false, true],
  },
  {
    placeholder: ['Select an item'],
    triggerVariant: ['label'],
    warning: [true],
    invalid: [true],
    triggerProps: [{}],
    selectedOption: [complexOption],
    isOpen: [false],
  },
  {
    placeholder: [
      'A very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very very long placeholder',
    ],
    disabled: [false],
    triggerVariant: ['label', 'option'],
    triggerProps: [{}],
    selectedOption: [null, longOption],
  },
  {
    placeholder: ['Select an item'],
    disabled: [true, false],
    triggerVariant: ['option'],
    triggerProps: [{}],
    selectedOption: [complexOptionWithCustomSvg],
  },
]);

export default function InputPermutations() {
  return (
    <>
      <h1>Select trigger permutations</h1>
      <ScreenshotArea>
        <PermutationsView permutations={permutations} render={permutation => <Trigger {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
