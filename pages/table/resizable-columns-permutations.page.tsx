// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Link from '~components/link';
import Table, { TableProps } from '~components/table';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { ariaLabels, Item } from './shared-configs';

/* eslint-disable react/jsx-key */
const permutations = createPermutations<TableProps<Item>>([
  {
    selectionType: ['single', undefined],
    resizableColumns: [true, false],
    items: [[{ number: 1, text: 'Dummy item' }]],
    columnDefinitions: [
      [
        { header: 'fixed width', cell: item => <Link>{item.number}</Link>, width: 100, minWidth: 80 },
        { header: 'auto-grow', cell: () => '-' },
      ],
      [
        { header: 'fixed width', cell: item => <Link>{item.number}</Link>, width: 800 },
        { header: 'with overflow', cell: () => '-', width: 500 },
      ],
      [
        { header: 'fixed width', cell: item => <Link>{item.number}</Link>, width: 600 },
        { header: 'no width', cell: item => item.text },
        { header: 'fixed with', cell: () => '-', width: 600 },
      ],
    ],
  },
]);
/* eslint-enable react/jsx-key */

export default function () {
  return (
    <>
      <h1>Table permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <Table
              // Multiple landmarks with same role + label combination is accessibility violation
              ariaLabels={{ ...ariaLabels, tableLabel: `Items ${permutations.indexOf(permutation)}` }}
              {...permutation}
            />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
