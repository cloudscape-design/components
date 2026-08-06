// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Alert, { AlertProps } from '~components/alert';
import Button from '~components/button';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import Link from '~components/link';

import createPermutations from '../utils/permutations';

const noop = () => void 0;

const types = ['info', 'success', 'warning', 'error'] as const;

/* eslint-disable react/jsx-key */
export const flashbarPermutations = createPermutations<FlashbarProps.MessageDefinition>([
  {
    type: [...types],
    header: ['Flash header'],
    content: [
      <span>
        Flash message with a{' '}
        <Link color="inverted" variant="primary">
          link
        </Link>
      </span>,
    ],
    action: [<Button>Action</Button>],
    dismissible: [true],
    dismissLabel: ['Dismiss'],
    onDismiss: [noop],
  },
]);

export const alertPermutations = createPermutations<AlertProps>([
  {
    type: [...types],
    header: ['Alert header'],
    children: [
      <span>
        Alert message with a <Link>link</Link>
      </span>,
    ],
    action: [<Button>Action</Button>],
    dismissible: [true],
    dismissAriaLabel: ['Dismiss'],
    onDismiss: [noop],
  },
]);
/* eslint-enable react/jsx-key */

export function renderFlashbar(permutation: FlashbarProps.MessageDefinition) {
  return <Flashbar items={[{ ...permutation, statusIconAriaLabel: permutation.type ?? 'info' }]} />;
}

export function renderAlert(permutation: AlertProps) {
  return <Alert statusIconAriaLabel={permutation.type} {...permutation} />;
}
