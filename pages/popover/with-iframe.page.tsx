// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, Popover, SpaceBetween, StatusIndicator } from '~components';
import Button from '~components/button';

import { IframeWrapper } from '../utils/iframe-wrapper';

function IframeContent() {
  return (
    <Box padding="m">
      <SpaceBetween size="l">
        <Popover
          header="Popover in iframe"
          content="This popover should render inside the iframe."
          dismissAriaLabel="Close"
          renderWithPortal={true}
        >
          <Button>With portal</Button>
        </Popover>
        <Popover
          header="Popover in iframe"
          content="This popover should render inside the iframe."
          dismissAriaLabel="Close"
          renderWithPortal={false}
        >
          <Button>Without portal</Button>
        </Popover>
        <Popover
          position="top"
          size="small"
          content={<StatusIndicator type="success">Copied</StatusIndicator>}
          dismissButton={false}
          triggerType="custom"
          renderWithPortal={true}
        >
          <Button iconName="copy">Copy</Button>
        </Popover>
      </SpaceBetween>
    </Box>
  );
}

export default function () {
  return (
    <Box margin="m">
      <h1>Popover in iframe</h1>
      <IframeWrapper id="popover-iframe" AppComponent={IframeContent} />
    </Box>
  );
}
