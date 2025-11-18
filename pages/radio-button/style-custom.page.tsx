// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { permutations, RadioButtonPermutation } from './common';
import customStyle from './custom-style';

export default function RadioButtonPermutations() {
  return (
    <>
      <h1>RadioButton permutations with custom styles</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={(permutation, index) => <RadioButtonPermutation {...permutation} index={index} style={customStyle} />}
        />
      </ScreenshotArea>
    </>
  );
}
