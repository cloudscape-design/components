// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Icon from '~components/icon';
import Token, { TokenProps } from '~components/token';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<TokenProps>([
  {
    label: ['token'],
    icon: [undefined, <Icon key="icon" name="settings" size="small" />],
    onDismiss: [undefined, () => {}],
    readOnly: [false, true],
    variant: ['inline'],
  },
  {
    label: ['token'],
    icon: [undefined, <Icon key="icon" name="settings" size="small" />],
    onDismiss: [undefined, () => {}],
    disabled: [true],
    variant: ['inline'],
  },
  {
    label: ['token'],
    icon: [undefined, <Icon key="icon" name="settings" />],
    onDismiss: [undefined, () => {}],
    readOnly: [false, true],
    variant: ['normal'],
  },
  {
    label: ['token'],
    icon: [undefined, <Icon key="icon" name="settings" />],
    onDismiss: [undefined, () => {}],
    disabled: [true],
    variant: ['normal'],
  },
  {
    label: ['token'],
    description: [undefined, 'description'],
    labelTag: ['label-tag', undefined],
    tags: [['tag-1', 'tag-2'], undefined],
    onDismiss: [undefined, () => {}],
    variant: ['normal'],
  },
  {
    label: ['token'],
    icon: [<Icon key="icon" name="settings" size="big" />],
    description: ['description'],
    labelTag: ['label-tag', undefined],
    tags: [['tag-1', 'tag-2'], undefined],
    readOnly: [false, true],
    disabled: [true, false],
    variant: ['normal'],
  },
]);

export default function TokenPermutations() {
  return (
    <>
      <h1>Token permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={(permutation, index) => <Token {...permutation} dismissLabel={`Dismiss ${index}`} />}
        />
      </ScreenshotArea>
    </>
  );
}
