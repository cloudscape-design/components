// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Button, Link } from '~components';
import Header, { HeaderProps } from '~components/header';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<HeaderProps>([
  {
    variant: ['h1', 'h2', 'h3'],
    info: [
      <Link key="info" variant="info">
        Info
      </Link>,
      null,
    ],
    description: ['description', null],
    counter: ['counter', undefined],
    actions: [<Button key="button" variant="primary"></Button>, null],
  },
]);

export default function HeaderPermutations() {
  return (
    <article>
      <h1>Header - Permutations</h1>
      <ScreenshotArea>
        <PermutationsView permutations={permutations} render={props => <Header {...props}>{props.variant}</Header>} />
      </ScreenshotArea>
    </article>
  );
}
