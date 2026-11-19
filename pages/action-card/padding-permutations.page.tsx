// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ActionCard, { ActionCardProps } from '~components/action-card';

import { PermutationsPage } from '../app/templates';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import { longHeader, onClick, reactNodeContent, shortContent, shortDescription } from './common';

const permutations = createPermutations<ActionCardProps>([
  // All padding toggle combinations with all slots present
  {
    header: [longHeader],
    description: [shortDescription],
    children: [shortContent],
    disableHeaderPaddings: [false, true],
    disableContentPaddings: [false, true],
    onClick: [onClick],
  },
  // Disabled paddings with custom React node content
  {
    children: [reactNodeContent],
    disableContentPaddings: [false, true],
    ariaLabel: ['Action card'],
    onClick: [onClick],
  },
  // Header padding only (no content)
  {
    header: [longHeader],
    disableHeaderPaddings: [false, true],
    onClick: [onClick],
  },
  // Content padding only (no header)
  {
    children: [shortContent],
    disableContentPaddings: [false, true],
    ariaLabel: ['Action card'],
    onClick: [onClick],
  },
  // All disabled paddings with disabled state
  {
    header: [longHeader],
    description: [shortDescription],
    children: [shortContent],
    disabled: [true],
    disableHeaderPaddings: [true],
    disableContentPaddings: [true],
    onClick: [onClick],
  },
]);

export default function ActionCardPaddingPermutations() {
  return (
    <PermutationsPage title="Action card padding permutations" i18n={{}}>
      <PermutationsView permutations={permutations} render={permutation => <ActionCard {...permutation} />} />
    </PermutationsPage>
  );
}
