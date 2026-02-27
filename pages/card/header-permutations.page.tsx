// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Card from '~components/internal/components/card';
import { type InternalCardProps } from '~components/internal/components/card/interfaces';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import { actions, CardPage, icon, longContent, longDescription, longHeader, shortHeader } from './common';

const permutations = createPermutations<InternalCardProps & { width?: number }>([
  // With header
  {
    header: [shortHeader, longHeader],
    children: [longContent],
    description: [undefined, longDescription],
    actions: [undefined, actions],
    icon: [undefined, icon],
  },
  // Without header and without description
  {
    header: [undefined],
    children: [longContent],
    description: [undefined],
    actions: [undefined, actions],
    icon: [undefined, icon],
  },
  // Without header but with description
  {
    header: [undefined],
    children: [longContent],
    description: [longDescription],
    actions: [undefined, actions],
    icon: [undefined],
  },
]);

export default function CardHeaderPermutations() {
  return (
    <CardPage title="Card header permutations">
      <PermutationsView permutations={permutations} render={permutation => <Card {...permutation} />} />
    </CardPage>
  );
}
