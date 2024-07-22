// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { DropdownOption } from '~components/internal/components/option/interfaces';
import Item from '~components/select/parts/item';
import { ItemProps } from '~components/select/parts/item';
import SpaceBetween from '~components/space-between';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const options: Record<string, DropdownOption> = {
  simpleOption: {
    option: { value: 'Option 1' },
  },
  complexOption: {
    option: {
      value: 'Complex option',
      labelTag: 'tag',
      description: 'description',
      iconName: 'share',
      tags: ['tag 1', 'tag 2', 'tag 3'],
      filteringTags: ['tag 1', 'tag 2'],
    },
  },
  longOption: {
    option: {
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
    },
  },
  group: {
    option: { value: 'Group 1' },
    type: 'parent',
  },
  child: {
    option: { value: 'Child 1' },
    type: 'child',
  },
  disabledGroup: {
    option: { value: 'Disabled group 1' },
    type: 'parent',
    disabled: true,
  },
  disabledChild: {
    option: { value: 'Disabled child' },
    type: 'child',
    disabled: true,
  },
  simpleOptionWithCustomSvg: {
    option: {
      value: 'With custom svg',
      iconSvg: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false">
          <circle cx="8" cy="8" r="7" />
          <circle cx="8" cy="8" r="3" />
        </svg>
      ),
    },
  },
  complexDisabledOptionWithCustomSvg: {
    option: {
      value: 'With custom svg',
      iconSvg: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false">
          <circle cx="8" cy="8" r="7" />
          <circle cx="8" cy="8" r="3" />
        </svg>
      ),
      labelTag: 'LabelTag',
      description: 'Description Description',
      tags: ['Tag1 ', 'Tag2 '],
    },
    disabled: true,
  },
};

const permutations = createPermutations<ItemProps>([
  {
    option: [options.simpleOption],
    highlighted: [false, true],
    selected: [false, true],
  },
  {
    option: [options.complexOption],
    highlighted: [false, true],
    selected: [false, true],
    highlightType: ['keyboard'],
    hasCheckbox: [true],
  },
  {
    option: [options.complexOption],
    filteringValue: ['a'],
  },
  {
    option: [options.group],
  },
  {
    option: [options.child],
  },
  {
    option: [options.disabledGroup],
  },
  {
    option: [options.disabledChild],
  },
  {
    option: [options.longOption],
  },
  {
    option: [options.simpleOptionWithCustomSvg],
  },
  {
    option: [options.complexDisabledOptionWithCustomSvg],
    hasCheckbox: [true],
  },
  {
    option: [options.simpleOption, options.complexOption],
    highlighted: [false, true],
    highlightType: ['keyboard'],
    selected: [true],
    hasCheckbox: [false],
  },
]);

export default function InputPermutations() {
  return (
    <>
      <h1>Select item permutations</h1>
      <ScreenshotArea>
        <SpaceBetween size="xs">
          <ul role="listbox" aria-label="list">
            <PermutationsView permutations={permutations} render={permutation => <Item {...permutation} />} />
          </ul>
        </SpaceBetween>
      </ScreenshotArea>
    </>
  );
}
