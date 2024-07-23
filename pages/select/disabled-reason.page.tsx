// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Box from '~components/box';
import Select from '~components/select';

import ScreenshotArea from '../utils/screenshot-area';

const options = [
  {
    value: '1',
    label: 'Option 1',
    disabled: true,
    disabledReason: 'disabled reason',
  },
  {
    value: '2',
    label: 'Option 2',
  },
];

export default function SelectPage() {
  return (
    <ScreenshotArea>
      <Box variant="h1">Select with disabled reason</Box>
      <Box padding="l">
        <div style={{ width: '400px' }}>
          <Select placeholder="Choose option" selectedOption={null} options={options} />
        </div>
      </Box>
    </ScreenshotArea>
  );
}
