// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import Button from '~components/button';
import DragHandleWrapper from '~components/internal/components/drag-handle-wrapper';

import ScreenshotArea from '../utils/screenshot-area';

export default function GridPage() {
  return (
    <>
      <h1>Drag handle demo</h1>
      <ScreenshotArea>
        <Box padding="l" textAlign="center">
          <DragHandleWrapper
            directions={{
              'block-start': 'active',
              'block-end': 'active',
              'inline-start': 'disabled',
              'inline-end': undefined,
            }}
            buttonLabels={{
              'block-start': 'Up',
              'block-end': 'Down',
              'inline-start': 'Before',
              'inline-end': undefined,
            }}
            onPress={direction => {
              console.log(direction);
            }}
            resizeTooltipText="Drag or select to move"
          >
            <Button variant="icon" iconName="drag-indicator" ariaLabel="Drag" />
          </DragHandleWrapper>
        </Box>
      </ScreenshotArea>
    </>
  );
}
