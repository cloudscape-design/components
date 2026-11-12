// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import { Box } from '~components';

import AssistantChat from '../app-layout/utils/field-registry-assistant-chat';

export default function FrameAssistant() {
  return (
    <Box padding="m">
      <AssistantChat />
    </Box>
  );
}
