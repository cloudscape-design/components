// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useMemo, useState } from 'react';

import Box from '~components/box';
import Button from '~components/button';
import Container from '~components/container';
import Header from '~components/header';
import LiveRegion from '~components/live-region';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';

export default function LiveRegionRapidAnnouncementsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  // Simulates the customer's pattern from GroupsList.tsx
  const { loadingMessage, loadedMessage } = useMemo(
    () => ({
      loadingMessage: isRefreshing ? `Refreshing... (${refreshCount})` : undefined,
      loadedMessage: isRefreshing && !isLoading ? `Refresh complete (${refreshCount})` : undefined,
    }),
    [isRefreshing, isLoading, refreshCount]
  );

  const handleRefresh = () => {
    setRefreshCount(prev => prev + 1);
    setIsRefreshing(true);
    setIsLoading(true);

    // Simulate loading completion after 1 second
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    // Reset after 2 seconds
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  return (
    <Box padding="l">
      <SpaceBetween size="l">
        <Header variant="h1">Live Region: Rapid Announcements Test</Header>

        <Container
          header={
            <Header
              variant="h2"
              description="This page tests the fix for AWSUI-61345: ensuring both announcements fire when refresh button is clicked"
            >
              Test Scenario
            </Header>
          }
        >
          <SpaceBetween size="m">
            <div>
              <strong>Expected behavior:</strong>
              <ol>
                <li>Click the &quot;Refresh&quot; button</li>
                <li>Screen reader should announce: &quot;Refreshing... (N)&quot;</li>
                <li>After ~1 second, screen reader should announce: &quot;Refresh complete (N)&quot;</li>
                <li>Both announcements should be heard clearly</li>
              </ol>
            </div>

            <div>
              <strong>Current state:</strong>
              <ul>
                <li>Refreshing: {isRefreshing ? 'Yes' : 'No'}</li>
                <li>Loading: {isLoading ? 'Yes' : 'No'}</li>
                <li>Refresh count: {refreshCount}</li>
              </ul>
            </div>

            <div>
              <LiveRegion hidden={true}>{loadingMessage}</LiveRegion>
              <LiveRegion hidden={true}>{loadedMessage}</LiveRegion>

              <Button
                id="refresh-button"
                iconName="refresh"
                loading={isLoading}
                onClick={handleRefresh}
                ariaLabel="Refresh data"
              >
                Refresh
              </Button>
            </div>

            <div>
              <strong>Status:</strong>
              <StatusIndicator type={isLoading ? 'loading' : 'success'}>
                {isLoading ? 'Loading...' : refreshCount === 0 ? 'Ready' : 'Complete'}
              </StatusIndicator>
            </div>
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Visual Announcement Log</Header>}>
          <SpaceBetween size="xs">
            <div>
              <em>This section shows what should be announced (for visual verification):</em>
            </div>
            {loadingMessage && (
              <div style={{ padding: '8px', backgroundColor: '#f0f0f0', borderLeft: '4px solid #0073bb' }}>
                🔊 {loadingMessage}
              </div>
            )}
            {loadedMessage && (
              <div style={{ padding: '8px', backgroundColor: '#f0f0f0', borderLeft: '4px solid #037f0c' }}>
                ✅ {loadedMessage}
              </div>
            )}
          </SpaceBetween>
        </Container>

        <Container header={<Header variant="h2">Testing Instructions</Header>}>
          <SpaceBetween size="s">
            <div>
              <strong>Manual Testing with Screen Reader:</strong>
              <ol>
                <li>Enable your screen reader (NVDA, JAWS, VoiceOver, etc.)</li>
                <li>Click the &quot;Refresh&quot; button</li>
                <li>
                  Listen for TWO announcements:
                  <ul>
                    <li>First: &quot;Refreshing... (N)&quot;</li>
                    <li>Second: &quot;Refresh complete (N)&quot; (after ~1 second)</li>
                  </ul>
                </li>
                <li>Click refresh multiple times to verify consistency</li>
                <li>The counter (N) helps distinguish each refresh cycle</li>
              </ol>
            </div>

            <div>
              <strong>Expected Results:</strong>
              <ul>
                <li>✅ Both announcements should be heard</li>
                <li>✅ Announcements should be in the correct order</li>
                <li>✅ No announcements should be skipped</li>
                <li>✅ Counter should increment with each refresh</li>
              </ul>
            </div>

            <div>
              <strong>Bug Reproduction (Before Fix):</strong>
              <ul>
                <li>❌ Only &quot;Refreshing...&quot; is announced</li>
                <li>❌ &quot;Refresh complete&quot; is NOT announced</li>
                <li>❌ Second announcement is lost</li>
              </ul>
            </div>

            <div>
              <strong>Screen Reader Quick Start:</strong>
              <ul>
                <li>
                  <strong>macOS VoiceOver:</strong> Press Cmd + F5 to enable
                </li>
                <li>
                  <strong>Windows NVDA:</strong> Download from{' '}
                  <a href="https://www.nvaccess.org/" target="_blank" rel="noopener noreferrer">
                    nvaccess.org
                  </a>
                  , then press Ctrl + Alt + N
                </li>
                <li>
                  <strong>Windows JAWS:</strong> If installed, press Insert + J
                </li>
              </ul>
            </div>
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </Box>
  );
}
