// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import DropdownStatus from '~components/internal/components/dropdown-status';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations([
  {
    children: [null, 'loading', <a key="link">link</a>],
  },
]);

export default function InputPermutations() {
  return (
    <>
      <h1>Dropdown status permutations</h1>
      <ScreenshotArea>
        <PermutationsView permutations={permutations} render={permutation => <DropdownStatus {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
