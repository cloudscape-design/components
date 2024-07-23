// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Option from '~components/internal/components/option';
import SelectableItem, { SelectableItemProps } from '~components/internal/components/selectable-item';
import SpaceBetween from '~components/space-between';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const simpleOption = <Option option={{ value: 'option 1', label: 'Label 1' }} />;
const iconOption = <Option option={{ value: 'option 1', label: 'Label 1', iconName: 'lock-private' }} />;
const bigOption = (
  <Option option={{ value: 'option 2', label: 'Label 2', iconName: 'share', tags: ['tag 1', 'tag 2', 'tag 3'] }} />
);

const optionHasBackground = <Option option={{ value: 'has background' }} />;
const optionGroupHeader = 'group header';
const childOption = 'child option';

const permutations = createPermutations<SelectableItemProps>([
  {
    selected: [false],
    highlighted: [false, true],
    disabled: [false, true],
    children: [simpleOption],
  },
  {
    selected: [false, true],
    highlighted: [false],
    disabled: [false, true],
    children: [iconOption],
  },
  {
    selected: [false, true],
    highlighted: [false],
    disabled: [false, true],
    children: [bigOption],
  },
  {
    selected: [false, true],
    highlighted: [true],
    highlightType: ['keyboard'],
    disabled: [false],
    children: [bigOption],
  },
  {
    selected: [false],
    highlighted: [false, true],
    disabled: [false],
    hasBackground: [true],
    children: [optionHasBackground],
  },
  {
    selected: [false],
    highlighted: [false],
    disabled: [true, false],
    isParent: [true],
    children: [optionGroupHeader],
  },
  {
    selected: [false, true],
    highlighted: [false, true],
    isChild: [true],
    children: [childOption],
  },
]);

export default function InputPermutations() {
  return (
    <>
      <h1>Selectable item permutations</h1>
      <ScreenshotArea>
        <SpaceBetween size="xs">
          <ul role="listbox" aria-label="list">
            <PermutationsView permutations={permutations} render={permutation => <SelectableItem {...permutation} />} />
          </ul>
        </SpaceBetween>
      </ScreenshotArea>
    </>
  );
}
