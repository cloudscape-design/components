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
  reactNodeContent,
  shortContent,
  shortDescription,
  shortHeader,
} from './common';

const permutations = createPermutations<ActionCardProps>([
  // With header
  {
    header: [shortHeader],
    description: [shortDescription, undefined],
    children: [shortContent, undefined],
    onClick: [onClick],
  },
  // With description
  {
    header: [shortHeader, undefined],
    description: [shortDescription],
    children: [shortContent, undefined],
    ariaLabel: ['Action card'],
    onClick: [onClick],
  },
  // With content
  {
    header: [shortHeader],
    description: [shortDescription, undefined],
    children: [shortContent],
    ariaLabel: ['Action card'],
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
  // Icon with position and alignment variations
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
    disabled: [false, true],
    onClick: [onClick],
  },
  // Padding variations
  {
    header: [shortHeader],
    description: [shortDescription],
    children: [shortContent],
    disableHeaderPaddings: [false, true],
    disableContentPaddings: [false, true],
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
  // ReactNode content
  {
    header: [shortHeader],
    description: [shortDescription],
    children: [reactNodeContent],
    onClick: [onClick],
  },
  // Header only
  {
    header: [shortHeader],
    onClick: [onClick],
  },
  // All content slots with disabled padding and disabled state
  {
    header: [shortHeader],
    description: [shortDescription],
    children: [shortContent],
    icon: [icon],
    disabled: [true],
    disableHeaderPaddings: [true],
    disableContentPaddings: [true],
    onClick: [onClick],
  },
  // Variant variations
  {
    header: [shortHeader],
    description: [shortDescription],
    children: [shortContent],
    variant: ['default', 'embedded'],
    onClick: [onClick],
  },
  // Variant with icon
  {
    header: [shortHeader],
    description: [shortDescription],
    icon: [icon],
    variant: ['default', 'embedded'],
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
