// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Link from '~components/link';
import RadioGroup, { RadioGroupProps } from '~components/radio-group';

import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';
import ScreenshotArea from '../utils/screenshot-area';

const permutations = createPermutations<RadioGroupProps>([
  {
    value: ['first'],
    items: [
      [
        { value: 'first', label: 'First Button' },
        { value: 'second', label: 'Second Button' },
        { value: 'third', label: 'Third Button', disabled: true },
      ],
      [
        {
          value: 'first',
          label:
            'Long text, long enough to wrap.  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Whatever.',
        },
        {
          value: 'second',
          label:
            'Long text, long enough to wrap.  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Whatever.',
          description:
            'Long text, long enough to wrap.  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Whatever.',
        },
      ],
    ],
  },
  {
    value: ['second'],
    items: [
      [
        { value: 'first', label: 'First Button', description: 'Short description' },
        { value: 'second', label: 'Second Button', description: 'Short description' },
        { value: 'third', label: 'Third Button', description: 'Short description' },
      ],
      [
        { value: 'first', label: 'First Button', description: 'Short description', disabled: true },
        { value: 'second', label: 'Second Button', description: 'Short description' },
        {
          value: 'third',
          label: 'Description with link',
          description: (
            <>
              Long text,{' '}
              <Link variant="primary" fontSize="body-s" href="https://www.google.com">
                google
              </Link>{' '}
              long enough to wrap. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
              laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
              esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa
              qui officia deserunt mollit anim id est laborum. Whatever.
            </>
          ),
        },
        {
          value: 'forth',
          label: 'Description with icon',
          description: (
            <>
              Link at end of description{' '}
              <Link fontSize="body-s" variant="primary" external={true} externalIconAriaLabel="(External)">
                learn more
              </Link>
            </>
          ),
        },
        {
          value: 'fifth',
          label: 'Long description with icon',
          description: (
            <>
              Icon in the middle of long description. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.{' '}
              <Link fontSize="body-s" variant="primary" external={true} externalIconAriaLabel="(External)">
                learn more
              </Link>{' '}
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
              laborum.
            </>
          ),
        },
      ],
    ],
  },
  {
    readOnly: [true],
    value: ['first'],
    items: [
      [
        { value: 'first', label: 'First Button' },
        { value: 'second', label: 'Second Button' },
        { value: 'third', label: 'Third Button', disabled: true },
      ],
    ],
  },
]);

export default function RadioGroupPermutations() {
  return (
    <>
      <h1>RadioGroup permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => (
            <RadioGroup
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
