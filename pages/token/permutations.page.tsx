// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Token, { TokenProps } from '~components/token';

import img from '../icon/custom-icon.png';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

// const i18nStrings: TokenGroupProps.I18nStrings = {
//   limitShowFewer: 'Show less',
//   limitShowMore: 'Show more',
// };

const permutations = createPermutations<TokenProps>([
  {
    label: ['token'],
    labelTag: [undefined, 'label tag'],
    description: [undefined, 'description'],
    iconName: [undefined, 'settings'],
    iconAlt: ['icon'],
    dismissLabel: ['dismiss'],
    onDismiss: [undefined, () => {}],
    readOnly: [false, true],
    tags: [undefined, ['tag']],
    variant: ['inline', 'normal'],
  },
  {
    label: ['token'],
    labelTag: [undefined, 'label tag'],
    description: [undefined, 'description'],
    iconUrl: [img],
    iconAlt: ['icon'],
    dismissLabel: ['dismiss'],
    onDismiss: [undefined, () => {}],
    disabled: [false, true],
    tags: [undefined, ['tag']],
    variant: ['inline', 'normal'],
  },
  {
    label: ['token'],
    iconName: [undefined, 'settings'],
    iconAlt: ['icon'],
    dismissLabel: ['dismiss'],
    onDismiss: [undefined, () => {}],
    readOnly: [false, true],
    variant: ['inline', 'normal'],
    popoverProps: [
      undefined,
      {
        content: 'content',
      },
    ],
  },
]);

export default function TokenPermutations() {
  return (
    <>
      <h1>Token permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <Token
              onDismiss={() => {
                /*empty handler to suppress react controlled property warning*/
              }}
              {...permutation}
            />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
