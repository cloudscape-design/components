// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Option from '~components/internal/components/option';
import { OptionProps } from '~components/internal/components/option';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<OptionProps>([
  {
    option: [
      {
        value: 'value 1',
      },
      {
        label: 'label 2',
      },
      {
        label: 'label 3',
        description: 'description',
      },
      {
        label: 'label 4',
        labelTag: 'tag',
      },
      {
        label: 'label 5',
        tags: ['tag 1', 'tag 2', 'tag 3'],
      },
      {
        label: 'label 6',
        iconName: 'share',
        tags: ['tag 1', 'tag 2', 'tag 3'],
      },
      {
        label: 'label 7',
        iconName: 'share',
      },
      {
        label: 'label 9',
        iconName: 'share',
        tags: ['tag 1', 'tag 2', 'tag 3'],
        filteringTags: ['tag 1', 'tag 2'],
      },
      {
        label: 'label 9',
        labelTag: 'tag',
        description: 'description',
        iconName: 'share',
        tags: ['tag 1', 'tag 2', 'tag 3'],
        filteringTags: ['tag 1', 'tag 2'],
      },
      {
        label: 'label 10 disabled',
        labelTag: 'tag',
        description: 'description',
        iconName: 'share',
        tags: ['tag 1', 'tag 2', 'tag 3'],
        filteringTags: ['tag 1', 'tag 2'],
        disabled: true,
      },
    ],
  },
  {
    option: [
      {
        label: 'label 11',
        labelTag: 'tag',
        description: 'description',
        iconName: 'share',
        tags: ['tag 1', 'tag 2', 'tag 3'],
        filteringTags: ['tag 1', 'tag 2'],
      },
    ],
    highlightText: ['a'],
  },
]);

export default function InputPermutations() {
  return (
    <>
      <h1>Option permutations</h1>
      <ScreenshotArea>
        <PermutationsView permutations={permutations} render={permutation => <Option {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
