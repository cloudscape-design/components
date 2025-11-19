// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { SimplePage } from '../app/templates';
import PermutationsView from '../utils/permutations-view';
import { permutations, RadioButtonPermutation } from './common';

export default function RadioButtonPermutations() {
  return (
    <SimplePage title="RadioButton permutations">
      <PermutationsView
        permutations={permutations}
        render={(permutation, index) => <RadioButtonPermutation {...permutation} index={index} />}
      />
    </SimplePage>
  );
}
