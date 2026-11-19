// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import createPermutations from '../utils/permutations';
import {
  allOptions,
  grouped,
  OptionListPermutation,
  OptionListPermutations,
  plain,
  renderOption,
} from './permutations-common';

const permutations = createPermutations<OptionListPermutation>([
  {
    width: [240, 480],
    options: allOptions,
    selectionType: ['single'],
    selectedOptions: [[], [plain[1]]],
  },
  {
    width: [240],
    options: [grouped],
    selectionType: ['single'],
    selectedOptions: [[plain[1]]],
    renderOption: [renderOption],
  },
]);

export default function OptionListSinglePermutationsPage() {
  return <OptionListPermutations title="OptionList permutations: single selection" permutations={permutations} />;
}
