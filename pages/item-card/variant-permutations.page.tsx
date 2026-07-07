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
  imageContentDefault,
  imageContentEmbedded,
  longContent,
  longDescription,
  shortDescription,
  shortFooter,
  shortHeader,
} from './common';

/* Visual variant permutations: default vs embedded */
const permutations = createPermutations<ItemCardProps>([
  // Variants with all slots
  {
    header: [shortHeader],
    description: [shortDescription],
    children: [longContent],
    footer: [shortFooter],
    actions: [actions],
    icon: [icon],
    variant: ['default', 'embedded'],
  },
  // Variants with minimal content
  {
    children: [longContent],
    variant: ['default', 'embedded'],
  },
  // Variants with header only
  {
    header: [shortHeader],
    children: [longContent],
    variant: ['default', 'embedded'],
  },
  // Image in body (default variant)
  {
    header: [shortHeader],
    description: [longDescription],
    children: [imageContentDefault],
    disableContentPaddings: [true],
    variant: ['default'],
  },
  // Image in body (embedded variant)
  {
    header: [shortHeader],
    description: [longDescription],
    children: [imageContentEmbedded],
    disableContentPaddings: [true],
    variant: ['embedded'],
  },
]);

export default function CardVariantPermutations() {
  return (
    <CardPage title="Item card variant permutations">
      <PermutationsView permutations={permutations} render={permutation => <ItemCard {...permutation} />} />
    </CardPage>
  );
}
