// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { PermutationsView } from '@cloudscape-design/build-tools/src/test-pages-util';

import { SimplePage } from '../app/templates';
import { permutations, RadioButtonPermutation } from './common';

export default function RadioButtonPermutations() {
  return (
    <SimplePage title="RadioButton permutations" screenshotArea={{}}>
      <PermutationsView
        permutations={permutations}
        render={(permutation, index) => <RadioButtonPermutation {...permutation} index={index} />}
      />
    </SimplePage>
  );
}
