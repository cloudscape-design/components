// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Multiselect, { MultiselectProps } from '~components/multiselect';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { deselectAriaLabel, i18nStrings } from './constants';

const options: MultiselectProps.Options = [
  { value: 'first', label: 'Simple' },
  { value: 'second', label: 'Second option' },
];

const permutations = createPermutations<MultiselectProps>([
  {
    placeholder: ['Select an item'],
    disabled: [false, true],
    options: [options],
    selectedOptions: [[], [options[0], options[1]]],
    deselectAriaLabel: [deselectAriaLabel],
    i18nStrings: [i18nStrings],
    inlineLabelText: [
      'Inline label',
      'Very long inline label that should wrap into multiple lines on narrow enough viewports',
    ],
    inlineTokens: [undefined, true],
  },
]);

export default function MultiselectInlineLabelTextPermutations() {
  return (
    <>
      <h1>Multiselect inlineLabelText permutations</h1>
      <ScreenshotArea>
        <PermutationsView permutations={permutations} render={permutation => <Multiselect {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
