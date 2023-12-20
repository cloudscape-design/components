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
    margin: spacings,
  },
]);

export default function BoxPermutations() {
  return (
    <>
      <h1>Box component - margins</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <div className={styles['permutation-box']}>
              <Box {...permutation} className={styles['permutation-box']}>
                m: {JSON.stringify(permutation.margin)}
              </Box>
            </div>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
