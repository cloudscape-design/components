// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Box from '~components/box';
import { Checkbox, SpaceBetween, Spinner } from '~components';

export default function SpinnerLatencyMetricsPage() {
  const [mounted, setMounted] = useState(true);
  return (
    <Box padding="xxl">
      <h1>Latency metrics, Spinner</h1>
      <SpaceBetween size="xxl">
        <SpaceBetween size="xs">
          <Checkbox checked={mounted} onChange={e => setMounted(e.detail.checked)}>
            Mounted
          </Checkbox>
        </SpaceBetween>

        {mounted && <Spinner id="my-loading-spinner" size="large" />}
      </SpaceBetween>
    </Box>
  );
}
