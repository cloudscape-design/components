// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import DragHandleWrapper from '~components/internal/components/drag-handle-wrapper';

import ScreenshotArea from '../utils/screenshot-area';

export default function GridPage() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <h1>Drag handle demo</h1>
      <ScreenshotArea>
        <Box padding="l" textAlign="center">
          <DragHandleWrapper
            open={open}
            directions={{
              'block-start': 'visible',
              'block-end': 'visible',
              'inline-start': 'disabled',
              'inline-end': 'visible',
            }}
            onPress={direction => console.log(direction)}
            onClose={() => setOpen(false)}
          >
            <Button
              variant="icon"
              iconName="drag-indicator"
              onClick={event => {
                console.log({ button: event.detail.button });
                setOpen(show => !show);
              }}
              ariaLabel="Drag"
            />
          </DragHandleWrapper>
        </Box>
      </ScreenshotArea>
    </>
  );
}
