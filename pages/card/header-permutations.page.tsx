// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Card from '~components/card';
import { InternalCardProps } from '~components/card/interfaces';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import {
  actions,
  CardPage,
  iconName,
  longContent,
  longDescription,
  longFooter,
  longHeader,
  reactNodeContent,
  shortDescription,
  shortFooter,
  shortHeader,
} from './common';

const permutations = createPermutations<InternalCardProps & { width?: number }>([
  // With header
  {
    header: [shortHeader, longHeader],
    children: [longContent],
    description: [undefined, longDescription],
    actions: [undefined, actions],
    iconName: [undefined, iconName],
  },
  // Without header and without description
  {
    header: [undefined],
    children: [longContent],
    description: [undefined],
    actions: [undefined, actions],
    iconName: [undefined, iconName],
  },
  // Without header but with description
  {
    header: [undefined],
    children: [longContent],
    description: [longDescription],
    actions: [undefined, actions],
    iconName: [undefined],
  },
  // Without footer
  {
    header: [shortHeader],
    children: [longContent],
    description: [shortDescription],
    actions: [actions],
    iconName: [undefined],
    footer: [shortFooter, longFooter],
  },
  // With custom paddings
  {
    children: [reactNodeContent],
    disableHeaderPaddings: [true],
    disableContentPaddings: [true],
  },
]);

export default function CardHeaderPermutations() {
  return (
    <CardPage title="Card header permutations">
      <PermutationsView permutations={permutations} render={permutation => <Card {...permutation} />} />
    </CardPage>
  );
}
