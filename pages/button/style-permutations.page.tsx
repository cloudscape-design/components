// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button, { ButtonProps } from '~components/button';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<ButtonProps>([
  {
    ariaLabel: ['Border Styles'],
    children: ['Border Styles'],
    disabled: [false, true],
    iconName: ['add-plus'],
    iconAlt: ['add-plus'],
    style: [
      {
        root: {
          borderColor: {
            active: 'purple',
            default: 'magenta',
            hover: 'orange',
            disabled: 'brown',
          },
          borderRadius: '2px',
          borderWidth: '4px',
        },
      },
    ],
    variant: ['primary', 'normal', 'link', 'icon', 'inline-icon', 'inline-link'],
  },
  {
    ariaLabel: ['Background and Color Styles'],
    children: ['Background and Color Styles'],
    disabled: [false, true],
    iconName: ['arrow-left'],
    iconAlt: ['arrow-left'],
    loading: [false, true],
    style: [
      {
        root: {
          background: {
            active: 'brown',
            default: 'purple',
            hover: 'brown',
            disabled: '#ccc',
          },
          borderWidth: '0px',
          color: {
            active: 'white',
            default: 'white',
            hover: 'white',
            disabled: 'black',
          },
        },
      },
    ],
    variant: ['primary', 'normal', 'link', 'icon', 'inline-icon', 'inline-link'],
  },
  {
    ariaLabel: ['Padding Styles'],
    children: ['Padding Styles'],
    disabled: [false, true],
    iconName: ['delete-marker'],
    iconAlt: ['delete-marker'],
    iconAlign: ['left', 'right'],
    loading: [false, true],
    fullWidth: [false, true],
    style: [
      {
        root: {
          borderColor: {
            active: 'black',
            default: 'black',
            disabled: 'black',
            hover: 'black',
          },
          borderWidth: '2px',
          borderRadius: '1px',
          paddingBlock: '22px',
          paddingInline: '44px',
        },
      },
    ],
    variant: ['primary', 'normal', 'link', 'icon', 'inline-icon', 'inline-link'],
  },
]);

export default function ButtonStylePermutations() {
  return (
    <>
      <h1>Button Style permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView permutations={permutations} render={permutation => <Button {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
