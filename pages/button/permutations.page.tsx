// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Button, { ButtonProps } from '~components/button';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import img from '../icon/custom-icon.png';

const permutations = createPermutations<ButtonProps>([
  {
    disabled: [false, true],
    loading: [false, true],
    iconName: [undefined, 'settings'],
    iconAlign: ['left', 'right'],
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
    disabled: [false, true],
    iconName: ['settings'],
    iconAlign: ['left', 'right'],
    children: ['Link to Home Page'],
    href: [undefined, '/choco/home'],
    variant: ['link'],
    download: [true, 'download'],
  },
  {
    disabled: [false, true],
    iconName: ['settings'],
    iconAlign: ['left', 'right'],
    ariaLabel: ['Standalone'],
    variant: ['icon', 'inline-icon', 'normal'],
  },
  {
    iconUrl: [img],
    iconAlt: ['letter A'],
    iconAlign: ['left', 'right'],
    children: ['With custom icon'],
    variant: ['normal'],
  },
  {
    children: [
      'A very long text, long enough to wrap the tab label. Ut eleifend nisi non dui imperdiet iaculis. Vestibulum volutpat est mi, nec luctus augue eleifend vel. Ut tellus nisl, ultrices mattis leo non, faucibus aliquet est. Ut eleifend nisi non dui imperdiet iaculis.',
      'AVeryLongWordLongEnoughToWrapTheTabLabelUtEleifendNisiNonDuiImperdietIaculisVestibulumVolutpatEstMiNecLuctusAugueEleifendVelUtTellusNislUltricesMattisLeoNonFaucibusAliquetEstUtEleifendNisiNonDuiImperdietIaculis',
    ],
  },
  {
    iconSvg: [
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" key="0">
        <g>
          <line x1="5.5" y1="12" x2="5.5" y2="15" />
          <line x1="0.5" y1="15" x2="10.5" y2="15" />
          <rect x="1" y="5" width="9" height="7" />
          <polyline points="5 4 5 1 14 1 14 8 10 8" />
        </g>
      </svg>,
    ],
    iconAlign: ['left', 'right'],
    children: ['With custom svg icon'],
    ariaLabel: ['With custom svg icon'],
    variant: ['normal', 'icon', 'inline-icon', 'primary'],
  },
  {
    fullWidth: [true],
    ariaLabel: ['Full width'],
    variant: ['normal', 'primary', 'link'],
    children: ['Full width'],
  },
  {
    fullWidth: [true],
    iconName: ['settings'],
    iconAlign: ['left', 'right'],
    ariaLabel: ['Full width'],
    variant: ['normal', 'primary', 'link'],
    children: ['Full width'],
  },
  {
    variant: ['inline-link'],
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
      <h1>Button permutations</h1>
      <ScreenshotArea>
        <PermutationsView permutations={permutations} render={permutation => <Button {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
