// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ActionCard, { ActionCardProps } from '~components/action-card';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import {
  icon,
  longContent,
  longDescription,
  longHeader,
  onClick,
  shortContent,
  shortDescription,
  shortHeader,
} from './common';

/* Content slot combinations: header, description, children, icon */
const permutations = createPermutations<ActionCardProps>([
  // All content slots filled
  {
    header: [shortHeader],
    description: [shortDescription],
    children: [shortContent],
    icon: [icon],
    iconVerticalAlignment: ['top'],
    onClick: [onClick],
  },
  // Header variations
  {
    header: [shortHeader, longHeader, undefined],
    description: [shortDescription],
    children: [shortContent],
    ariaLabel: ['Action card'],
    onClick: [onClick],
  },
  // Description variations
  {
    header: [shortHeader],
    description: [shortDescription, longDescription, undefined],
    children: [shortContent],
    onClick: [onClick],
  },
  // Icon with alignment variations
  {
    header: [shortHeader],
    description: [shortDescription],
    icon: [icon],
    iconVerticalAlignment: ['top', 'center'],
    onClick: [onClick],
  },
  // Icon with children content
  {
    header: [shortHeader],
    children: [shortContent],
    icon: [icon],
    iconVerticalAlignment: ['top', 'center'],
    onClick: [onClick],
  },
  // Disabled state
  {
    header: [shortHeader],
    description: [shortDescription],
    children: [shortContent],
    disabled: [false, true],
    onClick: [onClick],
  },
  // Long content wrapping
  {
    header: [longHeader],
    description: [longDescription],
    children: [longContent],
    icon: [icon],
    iconVerticalAlignment: ['top', 'center'],
    onClick: [onClick],
  },
  // Minimal: content only
  {
    children: [shortContent],
    ariaLabel: ['Minimal card'],
    onClick: [onClick],
  },
  // Header only
  {
    header: [shortHeader],
    onClick: [onClick],
  },
]);

export default function ActionCardPermutations() {
  return (
    <>
      <h1>Action card permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <div style={{ maxInlineSize: '400px' }}>
              <ActionCard {...permutation} />
            </div>
          )}
        />
      </ScreenshotArea>
    </>
  );
}
