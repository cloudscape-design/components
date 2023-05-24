// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';
import ScreenshotArea from '../utils/screenshot-area';
import ColumnLayout from '~components/column-layout';
import { Box, Link } from '~components';

export default function ColumnLayoutPage() {
  return (
    <>
      <h1>Column layout demo</h1>
      <ScreenshotArea
        style={{
          // text-grid variant has -2rem outer margins that we need to accommodate
          padding: '2rem',
        }}
      >
        <h2>Dashboard widget (new)</h2>
        <ColumnLayout minColumnWidth={170} variant="text-grid">
          <div>
            <Box variant="awsui-key-label">Running instances</Box>
            <Link variant="awsui-value-large" href="#">
              14
            </Link>
          </div>
          <div>
            <Box variant="awsui-key-label">Volumes</Box>
            <Link variant="awsui-value-large" href="#">
              126
            </Link>
          </div>
          <div>
            <Box variant="awsui-key-label">Security groups</Box>
            <Link variant="awsui-value-large" href="#">
              116
            </Link>
          </div>
          <div>
            <Box variant="awsui-key-label">Load balancers</Box>
            <Link variant="awsui-value-large" href="#">
              28
            </Link>
          </div>
        </ColumnLayout>
        <h2>Dashboard widget (current)</h2>
        <ColumnLayout columns={4} variant="text-grid">
          <div>
            <Box variant="awsui-key-label">Running instances</Box>
            <Link variant="awsui-value-large" href="#">
              14
            </Link>
          </div>
          <div>
            <Box variant="awsui-key-label">Volumes</Box>
            <Link variant="awsui-value-large" href="#">
              126
            </Link>
          </div>
          <div>
            <Box variant="awsui-key-label">Security groups</Box>
            <Link variant="awsui-value-large" href="#">
              116
            </Link>
          </div>
          <div>
            <Box variant="awsui-key-label">Load balancers</Box>
            <Link variant="awsui-value-large" href="#">
              28
            </Link>
          </div>
        </ColumnLayout>

        <h2>With borders</h2>
        {[1, 2].map(i => (
          <ColumnLayout key={i} columns={4} borders="all">
            <div>One</div>
            <div>Two</div>
            <div>Three</div>
            <div>Four</div>
            <div>Five</div>
            <div>Six</div>
            <div>Seven</div>
            <div>Eight</div>
          </ColumnLayout>
        ))}

        <h2>With gutters disabled</h2>
        {[1, 2].map(i => (
          <ColumnLayout key={i} columns={4} borders="all" disableGutters={true}>
            <div>One</div>
            <div>Two</div>
            <div>Three</div>
            <div>Four</div>
            <div>Five</div>
            <div>Six</div>
            <div>Seven</div>
            <div>Eight</div>
          </ColumnLayout>
        ))}

        <h2>text-grid variant</h2>

        <ColumnLayout variant="text-grid" borders="none" columns={3}>
          <div>a</div>
          <div>b</div>
          <div>c</div>
          <div>a</div>
          <div>b</div>
          <div>c</div>
        </ColumnLayout>

        <h2>Nested with borders</h2>

        <ColumnLayout columns={3} borders="vertical">
          <div>a</div>
          <ColumnLayout columns={2}>
            <div>b</div>
            <div>b</div>
          </ColumnLayout>
          <div>a</div>
        </ColumnLayout>
      </ScreenshotArea>
    </>
  );
}
