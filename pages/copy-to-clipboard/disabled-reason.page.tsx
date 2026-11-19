// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box, CopyToClipboard, SpaceBetween } from '~components';

import ScreenshotArea from '../utils/screenshot-area';

const textToCopy = 'Lorem ipsum dolor sit amet';

export default function CopyToClipboardDisabledReasonScenario() {
  return (
    <ScreenshotArea>
      <Box>
        <SpaceBetween size="l">
          <h1>Copy to clipboard with disabled reason</h1>

          <CopyToClipboard
            data-testid="disabled-button"
            variant="button"
            copyButtonText="Copy"
            textToCopy={textToCopy}
            copySuccessText="Text copied"
            copyErrorText="Text failed to copy"
            disabled={true}
            disabledReason="This action is available when a resource has been selected."
          />

          <CopyToClipboard
            data-testid="disabled-icon"
            variant="icon"
            copyButtonAriaLabel="Copy text"
            textToCopy={textToCopy}
            copySuccessText="Text copied"
            copyErrorText="Text failed to copy"
            disabled={true}
            disabledReason="This action is available when a resource has been selected."
          />

          <CopyToClipboard
            data-testid="disabled-inline"
            variant="inline"
            copyButtonAriaLabel="Copy text"
            textToCopy={textToCopy}
            copySuccessText="Text copied"
            copyErrorText="Text failed to copy"
            disabled={true}
            disabledReason="This action is available when a resource has been selected."
          />
        </SpaceBetween>
      </Box>
    </ScreenshotArea>
  );
}
