// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

import { Box, SpaceBetween, TimeInput, TimeInputProps } from '~components';

const permutations = createPermutations<TimeInputProps>([
  {
    value: ['', '12:33:44', '23:33:44'],
    placeholder: ['hh:mm:ss'],
    format: ['hh', 'hh:mm', 'hh:mm:ss'],
    invalid: [false, true],
    disabled: [false, true],
    readOnly: [false, true],
    name: ['Some Name'],
    ariaLabel: ['Some label'],
    use24Hour: [false, true],
  },
  {
    value: [''],
    placeholder: ['hh', 'hh:mm', 'hh:mm:ss'],
    format: ['hh:mm:ss'],
    invalid: [false, true],
    disabled: [false, true],
    readOnly: [false, true],
    name: ['Some Name'],
    ariaLabel: ['Some label'],
  },
]);

export default function TimeInputPermutations() {
  return (
    <Box padding="l">
      <h1>Time Input permutations</h1>
      <ScreenshotArea>
        <SpaceBetween size="m">
          <PermutationsView
            permutations={permutations}
            render={permutation => (
              <TimeInput
                onChange={() => {
                  /*empty handler to suppress react controlled property warning*/
                }}
                {...permutation}
              />
            )}
          />
        </SpaceBetween>
      </ScreenshotArea>
    </Box>
  );
}
