// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { createPermutations } from '@cloudscape-design/build-tools/src/test-pages-util';
import { PermutationsView } from '@cloudscape-design/build-tools/src/test-pages-util';

import Link, { LinkProps } from '~components/link';

import ScreenshotArea from '../utils/screenshot-area';

import styles from './styles.scss';

const permutations = createPermutations<LinkProps>([
  {
    href: ['#', undefined],
    children: ['Short', 'Hello world', 'Reallylongstringthatcannotwraptothenextline'],
  },
]);

export default function LinkPermutations() {
  return (
    <>
      <h1>Link icon overflow permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <div className={styles.narrow}>
              <Link {...permutation} external={true} externalIconAriaLabel={`Opens in a new tab`}>
                {permutation.children}
              </Link>
            </div>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
