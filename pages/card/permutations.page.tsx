// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Card from '~components/internal/components/card';
import { type InternalCardProps } from '~components/internal/components/card/interfaces';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import { actions, CardPage, icon, longContent, longHeader, shortDescription } from './common';

const permutations = createPermutations<InternalCardProps & { width?: number }>([
  {
    header: [longHeader, undefined],
    children: [longContent, undefined],
    description: [shortDescription, undefined],
    actions: [actions],
    icon: [icon],
    disableHeaderPaddings: [false, true],
    disableContentPaddings: [false, true],
  },
]);

export default function CardPermutations() {
  return (
    <CardPage title="Card permutations">
      <PermutationsView permutations={permutations} render={permutation => <Card {...permutation} />} />
    </CardPage>
  );
}
