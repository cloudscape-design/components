// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Alert, { AlertProps } from '~components/alert';
import Button from '~components/button';
import ScreenshotArea from '../utils/screenshot-area';
import createPermutations from '../utils/permutations';
import PermutationsView from '../utils/permutations-view';

/* eslint-disable react/jsx-key */
const permutations = createPermutations<AlertProps>([
  {
    type: ['warning', 'info', 'success', 'error', 'spinner'],
    children: [
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
  },
  {
    dismissAriaLabel: ['Close alert'],
    dismissible: [true],
    header: ['Default Example Header'],
  },
  {
    buttonText: ['Button text'],
    children: ['Default Example Body'],
  },
  {
    dismissible: [true],
    dismissAriaLabel: ['Close alert'],
    buttonText: ['Button text'],
    header: [
      'Default Example Header',
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
    children: [
      'Default Example Body',
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
  },
  {
    dismissible: [true, false],
    dismissAriaLabel: ['Close alert'],
    header: [undefined, 'Default Example Header'],
    children: [
      'Default Example Body',
      'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ],
    action: [
      <Button iconName="external" iconAlign="right">
        Show more
      </Button>,
    ],
  },
]);

export default function AlertScenario() {
  return (
    <article>
      <h1>Alert permutations</h1>
      <ScreenshotArea>
        <PermutationsView
          permutations={permutations}
          render={permutation => <Alert statusIconAriaLabel={permutation.type ?? 'Info'} {...permutation} />}
        />
      </ScreenshotArea>
    </article>
  );
}
