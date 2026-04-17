// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Flashbar, FlashbarProps, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';
import './css-style-api.css';

const noop = () => void 0;

const items: FlashbarProps.MessageDefinition[] = [
  {
    type: 'success',
    header: 'Success',
    content: 'Your action was completed successfully.',
    dismissible: true,
    onDismiss: noop,
    dismissLabel: 'Dismiss',
    id: 'success',
  },
  {
    type: 'error',
    header: 'Error',
    content: 'Something went wrong. Please try again.',
    dismissible: true,
    onDismiss: noop,
    dismissLabel: 'Dismiss',
    id: 'error',
  },
  {
    type: 'warning',
    header: 'Warning',
    content: 'Please review before continuing.',
    dismissible: true,
    onDismiss: noop,
    dismissLabel: 'Dismiss',
    id: 'warning',
  },
  {
    type: 'info',
    header: 'Info',
    content: 'Here is some useful information.',
    dismissible: true,
    onDismiss: noop,
    dismissLabel: 'Dismiss',
    id: 'info',
  },
  {
    type: 'in-progress',
    header: 'In progress',
    content: 'Your request is being processed.',
    id: 'in-progress',
  },
];

export default function Page() {
  return (
    <SimplePage title="Flashbar CSS Style API">
      <SpaceBetween size="l">
        <div>
          <h2>Default (unstyled)</h2>
          <Flashbar items={items} />
        </div>
        <div>
          <h2>Custom styled (class: my-flashbar)</h2>
          <div className="my-flashbar">
            <Flashbar items={items} />
          </div>
        </div>
        <div>
          <h2>Custom styled — stacked (class: my-flashbar)</h2>
          <div className="my-flashbar">
            <Flashbar items={items} stackItems={true} />
          </div>
        </div>
      </SpaceBetween>
    </SimplePage>
  );
}
