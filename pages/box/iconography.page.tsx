// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';
import Box from '~components/box';
import Icon from '~components/icon';
import ScreenshotArea from '../utils/screenshot-area';

export default function TextContentPermutations() {
  return (
    <ScreenshotArea>
      <Box variant="h1">
        <Icon name="status-positive" size="big" /> Heading 1
      </Box>
      <Box variant="h2">
        <Icon name="status-positive" size="medium" /> Heading 2
      </Box>
      <Box variant="h3">
        <Icon name="status-positive" size="normal" /> Heading 3
      </Box>
      <Box variant="h4">
        <Icon name="status-positive" size="normal" /> Heading 4
      </Box>
      <Box variant="h5">
        <Icon name="status-positive" size="normal" /> Heading 5
      </Box>
      <Box variant="p">
        <Icon name="status-positive" size="normal" /> paragraph
      </Box>
      <Box variant="small">
        <Icon name="status-positive" size="small" /> small
      </Box>
    </ScreenshotArea>
  );
}
