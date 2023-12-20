// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import TextContent from '~components/text-content';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import styles from './style.scss';

import Link, { LinkProps } from '~components/link';

const linkPermutations = createPermutations<LinkProps>([
  {
    variant: ['primary', 'secondary'],
    fontSize: ['body-s', 'heading-xl'],
    color: ['normal', 'inverted'],
    external: [false, true],
    href: ['#'],
  },
]);

export default function TextContentPermutations() {
  return (
    <ScreenshotArea>
      <h1>TextContent with nested links</h1>
      <TextContent>
        <PermutationsView
          permutations={linkPermutations}
          render={linkPermutation => (
            <div className={styles[linkPermutation.color as string]}>
              <Link {...linkPermutation} externalIconAriaLabel={`Opens in a new tab`}>
                {linkPermutation.variant} link with fontSize={linkPermutation.fontSize} and color=
                {linkPermutation.color}
              </Link>
              <small>
                <Link {...linkPermutation} externalIconAriaLabel={`Opens in a new tab`}>
                  {linkPermutation.variant} link with fontSize={linkPermutation.fontSize} and color=
                  {linkPermutation.color} in a small tag
                </Link>
              </small>
            </div>
          )}
        />
      </TextContent>
    </ScreenshotArea>
  );
}
