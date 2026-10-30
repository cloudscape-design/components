// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { ButtonDropdown, SpaceBetween } from '~components';

import { SimplePage } from '../app/templates';

import styles from './style-api-v2.scss';

const items = [
  { id: 'edit', text: 'Edit' },
  { id: 'duplicate', text: 'Duplicate' },
  { id: 'delete', text: 'Delete' },
];

const styleClassNames = {
  trigger: styles['trigger-brand'],
  mainAction: styles['trigger-brand'],
  dropdown: styles['dropdown-brand'],
};

export default function () {
  return (
    <SimplePage title="ButtonDropdown - Style API v2" screenshotArea={{}}>
      <SpaceBetween size="m" direction="horizontal">
        <ButtonDropdown items={items} {...{ styleClassNames }}>
          Actions
        </ButtonDropdown>
        <ButtonDropdown
          items={items}
          variant="primary"
          mainAction={{ text: 'Launch instance' }}
          ariaLabel="Launch options"
          {...{ styleClassNames }}
        />
        <ButtonDropdown items={items} variant="icon" ariaLabel="More actions" {...{ styleClassNames }} />
      </SpaceBetween>
    </SimplePage>
  );
}
