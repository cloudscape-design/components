// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Box from '~components/box';
import SpaceBetween from '~components/space-between';
import Button from '~components/button';

type Value = 'yes' | 'no' | undefined;

const ToggleButtonsPage = () => {
  const [value, setValue] = useState<Value>();

  return (
    <div role="group" aria-label="Website feedback form">
      <Box variant="h2">Did this page help you?</Box>
      <div style={{ marginTop: '16px', marginBottom: '20px' }}>
        <SpaceBetween size="xs" direction="horizontal">
          <Button
            variant="normal-toggle"
            iconName={value === 'yes' ? 'thumbs-up-filled' : 'thumbs-up'}
            pressed={value === 'yes'}
            onClick={() => setValue('yes')}
          >
            Yes
          </Button>
          <Button
            variant="normal-toggle"
            iconName={value === 'no' ? 'thumbs-down-filled' : 'thumbs-down'}
            pressed={value === 'no'}
            onClick={() => setValue('no')}
          >
            No
          </Button>
        </SpaceBetween>
      </div>
    </div>
  );
};

export default ToggleButtonsPage;
