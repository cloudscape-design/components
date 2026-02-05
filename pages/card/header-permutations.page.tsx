// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Card from '~components/internal/components/card';
import { InternalCardProps } from '~components/internal/components/card/interfaces';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import { actions, CardPage, icon, longContent, longDescription, longHeader, shortHeader } from './common';

const permutations = createPermutations<InternalCardProps & { width?: number }>([
  {
    header: [shortHeader, longHeader, undefined],
    children: [longContent],
    description: [undefined, longDescription],
    actions: [undefined, actions],
    icon: [undefined, icon],
  },
]);

export default function CardHeaderPermutations() {
  return (
    <CardPage title="Card header permutations">
      <PermutationsView permutations={permutations} render={permutation => <Card {...permutation} />} />
    </CardPage>
  );
}
