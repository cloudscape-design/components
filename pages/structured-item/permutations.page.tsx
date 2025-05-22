// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, Button, Icon, Link } from '~components';
import StructuredItem, { StructuredItemProps } from '~components/internal/components/structured-item';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const longBreakable =
  'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.';
// const longUnbreakable =
// 'Duis aute irure dolor in reprehenderitinvoluptatevelitessereprehenderitinvoluptatevelitessereprehenderitinvoluptatevelitessereprehenderitinvoluptatevelitesse';

/* eslint-disable react/jsx-key */
const permutations = createPermutations<StructuredItemProps & { viewportWidth: number }>([
  {
    viewportWidth: [200, 300, 600, 1000],
    content: [
      'Label',
      <div>
        Label with info link | <Link variant="info">Info</Link>
      </div>,
    ],
    secondaryContent: [null, <Box variant="small">Description</Box>, <Box variant="small">{longBreakable}</Box>],
    actions: [<Button variant="icon" iconName="settings" />],
    icon: [<Icon name="star" />],
  },
]);
/* eslint-enable react/jsx-key */

export default function ListItemPermutations() {
  return (
    <>
      <h1>List item permutations</h1>

      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={({ viewportWidth, ...permutation }) => (
            <div style={{ width: viewportWidth, borderRight: '1px solid red', overflow: 'hidden' }}>
              <StructuredItem {...permutation} />
            </div>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
