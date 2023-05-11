// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Box, Button } from '~components';

interface InspectorPanelProps {
  onClose: () => void;
}

export function InspectorPanel({ onClose }: InspectorPanelProps) {
  return (
    <Box>
      <Button onClick={onClose}>Close</Button>
    </Box>
  );
}
