// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import Button from '~components/button';
import Box from '~components/box';
import { Checkbox, SpaceBetween } from '~components';

export default function ButtonLatencyMetricsPage() {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(true);
  return (
    <Box padding="xxl">
      <h1>Latency metrics, loading state in Button</h1>
      <SpaceBetween size="xxl">
        <SpaceBetween size="xs">
          <Checkbox checked={mounted} onChange={e => setMounted(e.detail.checked)}>
            Mounted
          </Checkbox>
          <Checkbox checked={loading} onChange={e => setLoading(e.detail.checked)}>
            Loading
          </Checkbox>
        </SpaceBetween>

        {mounted && (
          <Button id="my-creation-button" loading={loading}>
            Non-primary button
          </Button>
        )}
      </SpaceBetween>
    </Box>
  );
}
