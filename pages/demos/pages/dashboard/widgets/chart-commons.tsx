// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
// Rewritten to use @cloudscape-design/components charts instead of @cloudscape-design/chart-components
import React from 'react';

import Box from '@cloudscape-design/components/box';

export const percentageFormatter = (value: number) => `${(value * 100).toFixed(0)}%`;

export const numberFormatter = (value: number) => {
  if (Math.abs(value) < 1000) {
    return value.toString();
  }
  return (value / 1000).toFixed(1) + 'k';
};

export const dateTimeFormatter = (value: Date | number) => {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });
};

export const dateFormatter = (value: Date | number) => {
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const commonEmptyState = (
  <Box textAlign="center" color="inherit">
    <b>No data available</b>
    <Box variant="p" color="inherit">
      There is no data available
    </Box>
  </Box>
);

export const commonNoMatchState = (
  <Box textAlign="center" color="inherit">
    <b>No matching data</b>
    <Box variant="p" color="inherit">
      There is no matching data to display
    </Box>
  </Box>
);
