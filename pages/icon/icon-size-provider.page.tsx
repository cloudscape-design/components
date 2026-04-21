// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Box from '~components/box';
import IconProvider from '~components/icon-provider';
import SpaceBetween from '~components/space-between';
import StatusIndicator from '~components/status-indicator';

import ScreenshotArea from '../utils/screenshot-area';

export default function IconSizeProviderScenario() {
  return (
    <ScreenshotArea>
      <h1>IconProvider iconSize prop</h1>

      <SpaceBetween size="l">
        {/* Baseline: no provider override — status icons render at default "normal" size */}
        <section>
          <Box variant="h2">No iconSize - Normal</Box>
          <SpaceBetween size="xs">
            <StatusIndicator type="success">Deployment succeeded</StatusIndicator>
            <StatusIndicator type="error">Build failed</StatusIndicator>
            <StatusIndicator type="warning">High memory usage</StatusIndicator>
            <StatusIndicator type="info">Update available</StatusIndicator>
            <StatusIndicator type="pending">Awaiting approval</StatusIndicator>
            <StatusIndicator type="in-progress">Deploying</StatusIndicator>
            <StatusIndicator type="stopped">Instance stopped</StatusIndicator>
          </SpaceBetween>
        </section>

        {/* Provider sets iconSize="small" — status icons should be 12×12 */}
        <section>
          <Box variant="h2">iconSize is set to small</Box>
          <IconProvider icons={{}} iconSize="small">
            <SpaceBetween size="xs">
              <StatusIndicator type="success">Deployment succeeded</StatusIndicator>
              <StatusIndicator type="error">Build failed</StatusIndicator>
              <StatusIndicator type="warning">High memory usage</StatusIndicator>
              <StatusIndicator type="info">Update available</StatusIndicator>
              <StatusIndicator type="pending">Awaiting approval</StatusIndicator>
              <StatusIndicator type="in-progress">Deploying</StatusIndicator>
              <StatusIndicator type="stopped">Instance stopped</StatusIndicator>
            </SpaceBetween>
          </IconProvider>
        </section>

        <section>
          <Box variant="h2">iconSiz is set to big</Box>
          <IconProvider icons={{}} iconSize="big">
            <SpaceBetween size="xs">
              <StatusIndicator type="success">Deployment succeeded</StatusIndicator>
              <StatusIndicator type="error">Build failed</StatusIndicator>
              <StatusIndicator type="warning">High memory usage</StatusIndicator>
              <StatusIndicator type="info">Update available</StatusIndicator>
              <StatusIndicator type="pending">Awaiting approval</StatusIndicator>
              <StatusIndicator type="in-progress">Deploying</StatusIndicator>
              <StatusIndicator type="stopped">Instance stopped</StatusIndicator>
            </SpaceBetween>
          </IconProvider>
        </section>

        {/* Nested provider resets to normal inside a dense region */}
        <section>
          <Box variant="h2">Nested: outer small, inner resets to normal</Box>
          <IconProvider icons={{}} iconSize="small">
            <SpaceBetween size="xs">
              <StatusIndicator type="success">Dense: deployment succeeded</StatusIndicator>
              <StatusIndicator type="error">Dense: build failed</StatusIndicator>
              <IconProvider icons={{}} iconSize="normal">
                <SpaceBetween size="xs">
                  <StatusIndicator type="success">Normal: deployment succeeded</StatusIndicator>
                  <StatusIndicator type="error">Normal: build failed</StatusIndicator>
                </SpaceBetween>
              </IconProvider>
            </SpaceBetween>
          </IconProvider>
        </section>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
