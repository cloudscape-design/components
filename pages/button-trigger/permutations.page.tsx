// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Box from '~components/box';
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

const responsivePermutations = createPermutations<ButtonTriggerProps>([
  {
    disabled: [true, false],
    children: ['Long label to check the regression'],
  },
  {
    disabled: [false],
    readOnly: [true],
    children: ['Long label to check the regression'],
  },
]);

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
        <Box margin={{ top: 'm' }}>
          {/* Permutations to check that the width of the trigger doesn't change between states */}
          <PermutationsView
            permutations={responsivePermutations}
            render={permutation => (
              <div style={{ display: 'flex' }}>
                <div>
                  <ButtonTrigger {...permutation} />
                </div>
                <div style={{ border: '1px solid' }}>Test</div>
              </div>
            )}
          />
        </Box>
      </ScreenshotArea>
    </>
  );
}
