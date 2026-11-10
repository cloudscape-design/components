// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, Button, SpaceBetween, StatusIndicator } from '~components';

import { BRIDGE_CHANNEL, EXAMPLE_VALUES, otherLoopbackOrigin } from '../app-layout/utils/field-registry-bridge';

interface BridgeResult {
  label: string;
  applied: boolean;
  message: string;
}

let lastRequestId = 0;

function callBridge<T>(request: Record<string, unknown>) {
  const id = ++lastRequestId;
  return new Promise<T>(resolve => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.source === window.parent &&
        event.origin === otherLoopbackOrigin() &&
        event.data?.channel === BRIDGE_CHANNEL &&
        event.data.id === id
      ) {
        window.removeEventListener('message', onMessage);
        resolve(event.data.result);
      }
    };
    window.addEventListener('message', onMessage);
    window.parent.postMessage({ channel: BRIDGE_CHANNEL, id, ...request }, otherLoopbackOrigin());
  });
}

export default function IsolatedAssistant() {
  const [results, setResults] = useState<ReadonlyArray<BridgeResult>>([]);
  const [busy, setBusy] = useState(false);

  const fill = async () => {
    setBusy(true);
    const fields = await callBridge<ReadonlyArray<{ label: string }>>({ type: 'read' });
    const labels = fields.map(field => field.label);
    const completed: BridgeResult[] = [];
    for (const [label, value] of EXAMPLE_VALUES.filter(([label]) => labels.includes(label))) {
      completed.push(await callBridge<BridgeResult>({ type: 'write', label, value }));
      setResults([...completed]);
    }
    setBusy(false);
  };

  return (
    <Box padding="m">
      <SpaceBetween size="m">
        <Button data-testid="fill-example-values" variant="primary" loading={busy} onClick={fill}>
          Fill example values
        </Button>
        <SpaceBetween size="xxs">
          {results.map(result => (
            <StatusIndicator
              key={result.label}
              data-testid="write-result"
              type={!result.applied ? 'error' : result.message === 'Set' ? 'success' : 'warning'}
            >
              {result.label}: {result.message}
            </StatusIndicator>
          ))}
        </SpaceBetween>
      </SpaceBetween>
    </Box>
  );
}
