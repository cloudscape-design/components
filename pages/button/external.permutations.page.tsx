// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button, { ButtonProps } from '~components/button';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<ButtonProps>([
  {
    disabled: [false, true],
    loading: [false, true],
    iconName: [undefined, 'settings'],
    iconAlign: ['left', 'right'],
    external: [true],
    children: [
      'Button',
      <>
        <em>Custom</em> content
      </>,
    ],
    href: [undefined, '/choco/home'],
    variant: ['normal', 'primary'],
  },
  {
    variant: ['inline-link'],
    external: [false, true],
    iconName: [undefined, 'download'],
    iconAlign: ['left', 'right'],
    children: ['Inline link'],
    loading: [false, true],
    disabled: [false, true],
  },
]);

export default function ButtonPermutations() {
  return (
    <>
      <h1>External button permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <Button {...permutation} i18nStrings={{ externalIconAriaLabel: '(opens in a new tab)' }} />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
