// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Box from '~components/box';
import Multiselect, { MultiselectProps } from '~components/multiselect';

import ScreenshotArea from '../utils/screenshot-area';

const options: MultiselectProps.Options = [
  { value: 'first', label: 'Simple' },
  { value: 'second', label: 'With small icon', iconName: 'folder' },
  {
    value: 'third',
    label: 'With big icon icon',
    description: 'Very big option',
    iconName: 'heart',
    disabled: true,
    disabledReason: 'disabled reason',
  },
  {
    label: 'Option group',
    options: [{ value: 'forth', label: 'Nested option' }],
    disabled: true,
    disabledReason: 'disabled reason',
  },
];

export default function MultiselectPage() {
  return (
    <ScreenshotArea>
      <Box variant="h1">Multiselect with disabled reason</Box>
      <Box padding="l">
        <div style={{ width: '400px' }}>
          <Multiselect placeholder="Choose option" selectedOptions={[]} options={options} />
        </div>
      </Box>
    </ScreenshotArea>
  );
}
