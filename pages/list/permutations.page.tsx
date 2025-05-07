// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import List, { ListProps } from '~components/list';
import ListItem from '~components/structured-item';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

/* eslint-disable react/jsx-key */
const permutations = createPermutations<ListProps>([
  {
    items: [[{ label: 'Item 1' }, { label: 'Item 2' }, { label: 'Item 3' }, { label: 'Item 4' }]],
  },
  {
    children: [
      [
        <li>Custom li child</li>,
        <div>Custom non-li child</div>,
        <li>Custom li child</li>,
        <div>Custom non-li child</div>,
        <ListItem label="List item child" />,
      ],
    ],
  },
]);
/* eslint-enable react/jsx-key */

export default function ListItemPermutations() {
  return (
    <>
      <h1>List item permutations</h1>
      <ScreenshotArea>
        <PermutationsView permutations={permutations} render={permutation => <List {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
