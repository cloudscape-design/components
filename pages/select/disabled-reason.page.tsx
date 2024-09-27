// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Select from '~components/select';

import ScreenshotArea from '../utils/screenshot-area';

const options = [...Array(50).keys()].map(n => {
  const numberToDisplay = (n + 1).toString();
  const baseOption = {
    value: numberToDisplay,
    label: `Option ${numberToDisplay}`,
  };
  if (n === 0 || n === 24 || n === 49) {
    return { ...baseOption, disabled: true, disabledReason: 'disabled reason' };
  }
  return baseOption;
});

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
