// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Box, { BoxProps } from '~components/box';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import spacings from './spacings';
import styles from './style.scss';

const permutations = createPermutations<BoxProps>([
  {
    display: ['block', 'inline-block'],
    padding: spacings,
  },
]);

export default function BoxPermutations() {
  return (
    <>
      <h1>Box component - paddings</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <span>
              <Box {...permutation} className={styles['permutation-box']}>
                p: {JSON.stringify(permutation.padding)}
              </Box>
            </span>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
