// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Checkbox, { CheckboxProps } from '~components/checkbox';
import Link from '~components/link';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<CheckboxProps>([
  {
    checked: [false],
    children: [''],
    ariaLabel: ['Checkbox'],
    description: ['', 'Short description'],
  },
  {
    checked: [false],
    children: [
      'Short label',
      'Long label.  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
    description: [
      '',
      'Short description',
      'Long description.  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      <>
        Link at end of description{' '}
        <Link fontSize="body-s" variant="primary" external={true} externalIconAriaLabel="(External)">
          learn more
        </Link>
      </>,
      <>
        Icon in the middle of long description. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
        laboris nisi ut aliquip ex ea commodo consequat.{' '}
        <Link fontSize="body-s" variant="primary" external={true} externalIconAriaLabel="(External)">
          external link
        </Link>{' '}
        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
        sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
      </>,
    ],
  },
  {
    disabled: [false, true],
    checked: [false, true],
    indeterminate: [false, true],
    children: ['Some label'],
    description: ['', 'Short description'],
  },
  {
    readOnly: [true],
    checked: [false, true],
    indeterminate: [false, true],
    children: ['Some label'],
    description: ['Short description'],
  },
]);

export default function CheckboxPermutations() {
  return (
    <>
      <h1>Checkbox permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <Checkbox
              onChange={() => {
                /*empty handler to suppress react controlled property warning*/
              }}
              {...permutation}
            />
          )}
        />
      </ScreenshotArea>
    </>
  );
}
