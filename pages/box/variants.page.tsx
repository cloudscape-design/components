// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Box, { BoxProps } from '~components/box';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import styles from './style.scss';

const variant = ['div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'p', 'strong', 'small', 'code', 'pre', 'samp'] as const;

const permutations = createPermutations<BoxProps>([
  {
    variant,
  },
  {
    variant,
    fontWeight: ['light', 'normal', 'bold', 'heavy'],
  },
  {
    variant,
    fontSize: ['body-s', 'body-m', 'heading-xs', 'heading-s', 'heading-m', 'heading-l', 'heading-xl', 'display-l'],
  },
  {
    variant,
    color: [
      'inherit',
      'text-label',
      'text-body-secondary',
      'text-status-error',
      'text-status-success',
      'text-status-info',
      'text-status-inactive',
      'text-status-warning',
    ],
  },
  {
    variant: ['awsui-value-large', 'awsui-key-label'],
  },
]);

export default function BoxPermutations() {
  return (
    <ScreenshotArea>
      <PermutationsView
        permutations={permutations}
        render={permutation => (
          <div className={styles[permutation.color as string]}>
            <Box {...permutation}>
              variant: {permutation.variant}
              {permutation.color && `, color:${permutation.color}`}
              {permutation.fontSize && `, fontSize:${permutation.fontSize}`}
              {permutation.fontWeight && `, fontWeight:${permutation.fontWeight}`}
            </Box>
          </div>
        )}
      />
    </ScreenshotArea>
  );
}
