// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import ItemCard from '~components/item-card';
import { ItemCardProps } from '~components/item-card/interfaces';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import {
  actions,
  CardPage,
  icon,
  longContent,
  longDescription,
  longFooter,
  longHeader,
  shortDescription,
  shortFooter,
  shortHeader,
} from './common';

/* Content slot combinations: header, description, children, footer, actions, icon */
const permutations = createPermutations<ItemCardProps>([
  // All content slots filled
  {
    header: [shortHeader],
    description: [shortDescription],
    children: [longContent],
    footer: [shortFooter],
    actions: [actions],
    icon: [icon],
  },
  // Header variations
  {
    header: [shortHeader, longHeader, undefined],
    description: [shortDescription],
    children: [longContent],
  },
  // Description variations
  {
    header: [shortHeader],
    description: [shortDescription, longDescription, undefined],
    children: [longContent],
    footer: [shortFooter],
  },
  // Footer variations
  {
    header: [longHeader],
    children: [longContent],
    footer: [longFooter, shortFooter, undefined],
  },
  // Actions with and without header
  {
    header: [shortHeader, undefined],
    children: [longContent],
    actions: [actions, undefined],
    description: [longDescription],
  },
  // Minimal: content only
  {
    children: [longContent],
  },
]);

export default function CardPermutations() {
  return (
    <CardPage title="Item card permutations">
      <PermutationsView permutations={permutations} render={permutation => <ItemCard {...permutation} />} />
    </CardPage>
  );
}
