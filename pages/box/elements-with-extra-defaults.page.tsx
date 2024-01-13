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
    variant: ['h1', 'h2', 'h3', 'h4', 'h5', 'p'],
    margin: ['n', 'xxl'],
  },
  {
    variant: ['h1', 'h2', 'h3', 'h4', 'h5', 'p'],
    padding: ['n', 'xxl'],
  },
  {
    variant: ['small'],
    display: ['none'],
  },
]);

export default function BoxPermutations() {
  return (
    <>
      <h1>Box component - elements with default layout properties</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <div className={styles['permutation-box']}>
              <Box {...permutation} className={styles['permutation-box']}>
                variant {permutation.variant} -{permutation.margin ? `margin: ${permutation.margin}` : ''}
                {permutation.padding ? `padding: ${permutation.padding}` : ''}
                {permutation.display ? `display: ${permutation.display}` : ''}
              </Box>
            </div>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
