// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import RadioButton from '~components/radio-button';

import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { permutations } from './common';

export default function RadioButtonPermutations() {
  return (
    <>
      <h1>RadioButton permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={(permutation, index) => (
            <RadioButton
              onChange={() => {
                /*empty handler to suppress react controlled property warning*/
              }}
              {...permutation}
              name={`radio-group-${index}`}
            />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
