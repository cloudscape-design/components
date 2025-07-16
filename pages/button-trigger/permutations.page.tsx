// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import ButtonTrigger, { ButtonTriggerProps } from '~components/internal/components/button-trigger';
import Option from '~components/internal/components/option';
import { OptionDefinition } from '~components/internal/components/option/interfaces';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const option1: OptionDefinition = {
  label: 'Option 1',
};

const option2: OptionDefinition = {
  label: 'label 2',
  labelTag: 'tag',
  description: 'description',
  iconName: 'share',
  tags: ['tag 1', 'tag 2', 'tag 3'],
  filteringTags: ['tag 1', 'tag 2'],
};

/* eslint-disable react/jsx-key */
const permutations = createPermutations<ButtonTriggerProps>([
  {
    pressed: [false, true],
    children: ['Label 1'],
  },
  {
    pressed: [false],
    disabled: [false, true],
    children: ['Label 2'],
  },
  {
    pressed: [false],
    disabled: [false],
    children: [<Option option={option1} />],
  },
  {
    pressed: [false],
    disabled: [false],
    invalid: [false, true],
    children: [<Option option={option2} />],
  },
  {
    pressed: [false],
    disabled: [true],
    children: [<Option option={{ ...option2, disabled: true }} />],
  },
  {
    pressed: [false],
    disabled: [false],
    readOnly: [true],
    children: [<Option option={{ ...option2, disabled: true }} />],
  },
]);
/* eslint-enable react/jsx-key */

export default function ButtonTriggerPermutations() {
  return (
    <>
      <h1>ButtonTrigger permutations</h1>
      <ScreenshotArea>
        <PermutationsView permutations={permutations} render={permutation => <ButtonTrigger {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
