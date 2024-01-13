// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import Utility, { UtilityProps } from '~components/top-navigation/1.0-beta/parts/utility';
import VisualContext from '~components/internal/components/visual-context';
import img from '../icon/custom-icon.png';
import styles from './styles.scss';

const svgIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false">
    <circle cx="8" cy="8" r="7" />
    <circle cx="8" cy="8" r="3" />
  </svg>
);

const permutations = createPermutations<UtilityProps>([
  // Link button
  {
    definition: [
      { type: 'button', text: 'Button' },
      { type: 'button', text: 'Button', external: true, externalIconAriaLabel: ' (opens in new tab)' },
      { type: 'button', text: 'Button', href: '#' },
      { type: 'button', text: 'Button', iconName: 'share' },
      { type: 'button', text: 'Button', iconName: 'share', badge: true },
      { type: 'button', text: 'Button', iconUrl: img, iconAlt: 'Circle' },
      { type: 'button', text: 'Button', iconSvg: svgIcon },
    ],
    hideText: [false],
  },
  // Primary button
  {
    definition: [
      { type: 'button', variant: 'primary-button', text: 'Primary' },
      {
        type: 'button',
        variant: 'primary-button',
        text: 'Primary',
        external: true,
        externalIconAriaLabel: ' (opens in new tab)',
      },
      { type: 'button', variant: 'primary-button', text: 'Primary', href: '#' },
    ],
    hideText: [false],
  },
  // Menu dropdown
  {
    definition: [
      { type: 'menu-dropdown', text: 'Menu', items: [] },
      { type: 'menu-dropdown', text: 'Menu', items: [], iconName: 'share' },
      { type: 'menu-dropdown', text: 'Menu', items: [], iconName: 'share', badge: true },
      { type: 'menu-dropdown', text: 'Menu', items: [], iconUrl: img, iconAlt: 'Circle' },
      { type: 'menu-dropdown', text: 'Menu', items: [], iconSvg: svgIcon },
    ],
    hideText: [false],
  },
  // Icons only
  {
    definition: [
      { type: 'button', iconName: 'folder', ariaLabel: 'New folder' },
      { type: 'button', iconName: 'folder', ariaLabel: 'New folder', badge: true },
      { type: 'menu-dropdown', iconName: 'folder', ariaLabel: 'New folder', items: [] },
    ],
    hideText: [true],
  },
  // Responsive treatments
  {
    definition: [
      { type: 'button', text: 'Button', iconName: 'undo' },
      { type: 'button', text: 'Button', iconName: 'undo', disableTextCollapse: true },
      { type: 'button', text: 'Button', iconName: 'undo', disableUtilityCollapse: true },
    ],
    hideText: [false, true],
    isNarrowViewport: [false, true],
  },
]);

export default function () {
  return (
    <>
      <h1>Top navigation utility permutations</h1>
      <ScreenshotArea>
        <VisualContext contextName="top-navigation" className={styles['utility-permutations']}>
          <PermutationsView permutations={permutations} render={permutation => <Utility {...permutation} />} />
        </VisualContext>
      </ScreenshotArea>
    </>
  );
}
