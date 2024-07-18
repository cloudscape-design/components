// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import Box, { BoxProps } from '~components/box';
import Link, { LinkProps } from '~components/link';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

import styles from './styles.scss';

const permutations = createPermutations<LinkProps>([
  {
    variant: ['primary', 'secondary'],
    fontSize: ['body-s', 'body-m', 'heading-xs', 'heading-s', 'heading-m', 'heading-l', 'heading-xl', 'display-l'],
    color: ['normal', 'inverted'],
    external: [false, true],
  },
]);

export default function LinkPermutations() {
  return (
    <>
      <h1>Link inheriting font size permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <Box fontSize={permutation.fontSize as BoxProps.FontSize}>
              <div className={clsx(permutation.color === 'inverted' && styles['container-inverted'])}>
                <Link {...permutation} fontSize="inherit" href="#" externalIconAriaLabel={`Opens in a new tab`}>
                  This is a link
                </Link>
              </div>
            </Box>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
