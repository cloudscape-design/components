// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ActionCard, { ActionCardProps } from '~components/action-card';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';
import { icon, longContent, longDescription, onClick, shortContent, shortDescription, shortHeader } from './common';

/* Visual variant permutations: default vs embedded */
const permutations = createPermutations<ActionCardProps>([
  // Variants with all slots
  {
    header: [shortHeader],
    description: [shortDescription],
    children: [shortContent],
    icon: [icon],
    variant: ['default', 'embedded'],
    onClick: [onClick],
  },
  // Variants with minimal content
  {
    children: [shortContent],
    variant: ['default', 'embedded'],
    ariaLabel: ['Action card'],
    onClick: [onClick],
  },
  // Variants with header only
  {
    header: [shortHeader],
    variant: ['default', 'embedded'],
    onClick: [onClick],
  },
  // Variants with icon and alignment
  {
    header: [shortHeader],
    description: [shortDescription],
    icon: [icon],
    iconVerticalAlignment: ['top', 'center'],
    variant: ['default', 'embedded'],
    onClick: [onClick],
  },
  // Variants with long content
  {
    header: [shortHeader],
    description: [longDescription],
    children: [longContent],
    variant: ['default', 'embedded'],
    onClick: [onClick],
  },
  // Variants with disabled state
  {
    header: [shortHeader],
    description: [shortDescription],
    children: [shortContent],
    disabled: [true],
    variant: ['default', 'embedded'],
    onClick: [onClick],
  },
]);

export default function ActionCardVariantPermutations() {
  return (
    <>
      <h1>Action card variant permutations</h1>
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
