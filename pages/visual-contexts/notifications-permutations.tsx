// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Alert, { AlertProps } from '~components/alert';
import Box from '~components/box';
import Button from '~components/button';
import Divider from '~components/divider';
import Flashbar, { FlashbarProps } from '~components/flashbar';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';

import createPermutations from '../utils/permutations';

const noop = () => void 0;

const types = ['info', 'success', 'warning', 'error'] as const;

// Embedded content is rendered by other components, which read the shared body text,
// link and divider tokens rather than inheriting from the notification.
function EmbeddedContent({ linkColor }: { linkColor?: 'inverted' }) {
  return (
    <SpaceBetween size="xs">
      <span>
        Message with a{' '}
        <Link color={linkColor} variant="primary">
          link
        </Link>{' '}
        and <Box variant="awsui-inline-code">inline code</Box>.
      </span>
      <Divider />
      <Box>Body text below a divider.</Box>
    </SpaceBetween>
  );
}

/* eslint-disable react/jsx-key */
export const flashbarPermutations = createPermutations<FlashbarProps.MessageDefinition>([
  {
    type: [...types],
    header: ['Flash header'],
    content: [<EmbeddedContent linkColor="inverted" />],
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
    children: [<EmbeddedContent />],
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
