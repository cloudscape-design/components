// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Button from '~components/button';
import SplitButton, { SplitButtonProps } from '~components/split-button';
import ButtonDropdown from '~components/button-dropdown';
import ScreenshotArea from '../utils/screenshot-area';
import PermutationsView from '../utils/permutations-view';
import createPermutations from '../utils/permutations';

const dropdownItems = [
  {
    id: '1',
    text: 'Option 1',
  },
  {
    id: '2',
    text: 'Option 2',
    href: '#',
    external: true,
    externalIconAriaLabel: '(opens in new tab)',
  },
  {
    id: '3',
    text: 'Option 3',
    disabled: true,
    disabledReason: 'Option 3 disabled reason',
  },
  {
    id: '4',
    text: 'Option 4',
  },
] as const;

const permutations = createPermutations<SplitButtonProps>([
  {
    children: [
      <>
        <ButtonDropdown items={dropdownItems}>Dropdown</ButtonDropdown>

        <Button iconName="add-plus">Button</Button>

        <Button href="#" iconName="external" iconAlign="right">
          Link
        </Button>
      </>,
      <>
        <Button variant="primary" iconName="add-plus">
          Button
        </Button>

        <ButtonDropdown variant="primary" items={dropdownItems} />
      </>,
    ],
  },
]);

export default function SplitButtonPermutations() {
  return (
    <>
      <h1>SplitButton permutations</h1>
      <ScreenshotArea disableAnimations={true}>
        <PermutationsView permutations={permutations} render={permutation => <SplitButton {...permutation} />} />
      </ScreenshotArea>
    </>
  );
}
