// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Box, { BoxProps } from '~components/box';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import styles from './style.scss';

const permutations = createPermutations<BoxProps>([
  {
    textAlign: ['left', 'right', 'center'],
  },
  {
    float: ['left', 'right'],
  },
]);

export default function BoxPermutations() {
  return (
    <>
      <h1>Box component - float and align</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <Box {...permutation} className={styles['permutation-box']}>
              {permutation.textAlign && `textAlign:${permutation.textAlign}`}
              {permutation.float && `float:${permutation.float}`}
            </Box>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
