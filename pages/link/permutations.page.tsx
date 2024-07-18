// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import clsx from 'clsx';

import Link, { LinkProps } from '~components/link';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

import styles from './styles.scss';

const permutations = createPermutations<LinkProps>([
  {
    variant: ['info'],
    external: [false, true],
    href: ['#', undefined],
    children: ['Info'],
  },
  {
    variant: ['primary', 'secondary'],
    fontSize: ['body-s', 'body-m', 'heading-xs', 'heading-s', 'heading-m', 'heading-l', 'heading-xl', 'display-l'],
    color: ['normal', 'inverted'],
    external: [false, true],
    href: ['#', undefined],
    children: [
      'This is a link.',
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    ],
  },
]);

export default function LinkPermutations() {
  return (
    <>
      <h1>Link permutations</h1>
      <ScreenshotArea style={{ maxWidth: 600 }}>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <div className={clsx(permutation.color === 'inverted' && styles['container-inverted'])}>
              <Link {...permutation} externalIconAriaLabel={`Opens in a new tab`}>
                {permutation.children}
              </Link>
            </div>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
