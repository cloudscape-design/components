// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { SimplePage } from '../app/templates';
import PermutationsView from '../utils/permutations-view';
import { permutations, RadioButtonPermutation } from './common';
import customStyle from './custom-style';

export default function RadioButtonPermutations() {
  return (
    <SimplePage title="RadioButton permutations with custom styles">
      <PermutationsView
        permutations={permutations}
        render={(permutation, index) => <RadioButtonPermutation {...permutation} index={index} style={customStyle} />}
      />
    </SimplePage>
  );
}
