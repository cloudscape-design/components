// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Link, Select } from '~components';
import Header, { HeaderProps } from '~components/header';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const commonProps = {
  info: (
    <Link key="info" variant="info">
      Info
    </Link>
  ),
  description: 'A description text with some content to simulate a text shown below the title of this header.',
  counter: '(1/10)',
};

const permutations = createPermutations<HeaderProps>([
  {
    variant: ['h1', 'h2', 'h3'],
    actions: [
      <Select
        key="select"
        options={[{ value: 'option-1', label: 'Option 1' }]}
        selectedOption={{ value: 'option-1', label: 'Option 1' }}
        inlineLabelText="Inline label"
      />,
      <div key="div" style={{ backgroundColor: 'pink', blockSize: 200 }}>
        Even taller actions
      </div>,
    ],
    children: [
      'Short header',
      'A quite long header text which will probably let the actions wrap below it unless the viewport width is quite large.',
    ],
  },
]);

export default function HeaderActionsHeightPermutations() {
  return (
    <article>
      <h1>Header - Actions height permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView permutations={permutations} render={props => <Header {...commonProps} {...props} />} />
      </ScreenshotArea>
    </article>
  );
}
