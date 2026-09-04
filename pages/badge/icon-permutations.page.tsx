// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Badge, { BadgeProps } from '~components/badge';

import img from '../icon/custom-icon.png';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<BadgeProps>([
  // Predefined icon with text, both alignments, across a sample of colors
  {
    color: ['grey', 'blue', 'green', 'red', 'severity-high'],
    iconName: ['status-info'],
    iconAlign: ['left', 'right'],
    children: ['ABC'],
  },
  // Icon combined with longer text and inline html to check vertical alignment
  {
    color: ['blue'],
    iconName: ['status-positive'],
    iconAlign: ['left', 'right'],
    children: [
      'Badge With A Very Long Text',
      <>
        Badge with <strong>html</strong>
      </>,
    ],
  },
  // Icon-only badges (no text) across colors
  {
    color: ['grey', 'blue', 'green', 'red', 'severity-critical'],
    iconName: ['status-warning'],
  },
  // Custom icon via URL
  {
    color: ['grey'],
    iconUrl: [img],
    iconAlt: ['letter A'],
    iconAlign: ['left', 'right'],
    children: ['With custom icon'],
  },
  // Custom icon via SVG slot (inherits badge color)
  {
    color: ['grey', 'green'],
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
  },
]);

export default function BadgeIconPermutations() {
  return (
    <>
      <h1>Badge icon permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView permutations={permutations} render={permutation => <Badge {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
