// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { PermutationsView } from '@cloudscape-design/build-tools/src/test-pages-util';

import RadioGroup from '~components/radio-group';

import ScreenshotArea from '../utils/screenshot-area';
import permutations from './common-permutations';

export default function RadioGroupPermutations() {
  return (
    <>
      <h1>RadioGroup permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <RadioGroup
              onChange={() => {
                /*empty handler to suppress react controlled property warning*/
              }}
              {...permutation}
            />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
