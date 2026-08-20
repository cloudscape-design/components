// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import { Box, CopyToClipboard, SpaceBetween } from '~components';

import ScreenshotArea from '../utils/screenshot-area';

// Simulates fetching large/expensive content asynchronously
function fetchLargeContent(delayMs: number): Promise<string> {
  return new Promise(resolve =>
    setTimeout(() => resolve(`Lazily fetched content (after ${delayMs}ms): ${new Date().toISOString()}`), delayMs)
  );
}

// Simulates a fetch that rejects
function fetchContentThatFails(): Promise<string> {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('Simulated fetch failure')), 300));
}

export default function CopyToClipboardLazyPage() {
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog(prev => [...prev, `${new Date().toISOString()} — ${msg}`]);

  return (
    <ScreenshotArea>
      <Box>
        <SpaceBetween size="l">
          <h1>CopyToClipboard — lazy / async text (getTextToCopy)</h1>

          <Box variant="h2">Synchronous getter</Box>
          <CopyToClipboard
            data-testid="copy-sync-getter"
            copyButtonText="Copy (sync getter)"
            textToCopy="fallback text"
            getTextToCopy={() => `Sync value computed at ${new Date().toISOString()}`}
            copySuccessText="Sync value copied"
            copyErrorText="Failed to copy"
            onCopySuccess={e => addLog(`sync success: ${e.detail.text}`)}
          />

          <Box variant="h2">Async getter — 800 ms delay</Box>
          <CopyToClipboard
            data-testid="copy-async-getter"
            copyButtonText="Copy (async getter)"
            textToCopy="fallback text"
            getTextToCopy={() => fetchLargeContent(800)}
            copySuccessText="Async value copied"
            copyErrorText="Failed to copy"
            onCopySuccess={e => addLog(`async success: ${e.detail.text}`)}
          />

          <Box variant="h2">Async getter that rejects</Box>
          <CopyToClipboard
            data-testid="copy-async-error"
            copyButtonText="Copy (async error)"
            textToCopy="fallback text"
            getTextToCopy={fetchContentThatFails}
            copySuccessText="Copied"
            copyErrorText="Fetch failed — could not copy"
            onCopyFailure={e => addLog(`async failure: ${e.detail.text}`)}
          />

          <Box variant="h2">Async getter — icon variant</Box>
          <CopyToClipboard
            data-testid="copy-async-icon"
            variant="icon"
            copyButtonAriaLabel="Copy async content"
            textToCopy="fallback text"
            getTextToCopy={() => fetchLargeContent(600)}
            copySuccessText="Async icon value copied"
            copyErrorText="Failed to copy"
          />

          <Box variant="h2">Async getter — inline variant</Box>
          <CopyToClipboard
            data-testid="copy-async-inline"
            variant="inline"
            copyButtonAriaLabel="Copy async inline content"
            textToCopy="Visible inline text (getTextToCopy overrides on click)"
            getTextToCopy={() => fetchLargeContent(500)}
            copySuccessText="Async inline value copied"
            copyErrorText="Failed to copy"
          />

          <Box variant="h2">No getter (original behaviour — textToCopy)</Box>
          <CopyToClipboard
            data-testid="copy-no-getter"
            copyButtonText="Copy (no getter)"
            textToCopy="Static text to copy"
            copySuccessText="Static text copied"
            copyErrorText="Failed to copy"
          />

          {log.length > 0 && (
            <Box>
              <Box variant="h3">Event log</Box>
              {log.map((entry, i) => (
                <Box key={i} variant="code">
                  {entry}
                </Box>
              ))}
            </Box>
          )}
        </SpaceBetween>
      </Box>
    </ScreenshotArea>
  );
}
