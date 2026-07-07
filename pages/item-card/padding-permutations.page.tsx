// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ItemCard from '~components/item-card';
import { ItemCardProps } from '~components/item-card/interfaces';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import { CardPage, longContent, longHeader, reactNodeContent, shortFooter } from './common';

/* Disable-padding permutations for header, content, and footer */
const permutations = createPermutations<ItemCardProps>([
  // All padding toggle combinations with all slots present
  {
    header: [longHeader],
    children: [longContent],
    footer: [shortFooter],
    disableHeaderPaddings: [false, true],
    disableContentPaddings: [false, true],
    disableFooterPaddings: [false, true],
  },
  // Disabled paddings with custom React node content
  {
    children: [reactNodeContent],
    disableContentPaddings: [false, true],
  },
  // Header padding only (no footer)
  {
    header: [longHeader],
    children: [longContent],
    disableHeaderPaddings: [false, true],
  },
  // Footer padding only (no header)
  {
    children: [longContent],
    footer: [shortFooter],
    disableFooterPaddings: [false, true],
  },
]);

export default function CardPaddingPermutations() {
  return (
    <CardPage title="Item card padding permutations">
      <PermutationsView permutations={permutations} render={permutation => <ItemCard {...permutation} />} />
    </CardPage>
  );
}
