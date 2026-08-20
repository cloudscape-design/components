// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Badge from '~components/badge';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

export default function BadgeTruncatePage() {
  return (
    <ScreenshotArea>
      <h1>Badge – text truncation</h1>
      <SpaceBetween size="m">
        <section>
          <h2>Without truncate (default behaviour)</h2>
          <div style={{ width: 120, border: '1px dashed #aaa', padding: 4 }}>
            <Badge color="blue">This is a very long badge label that overflows</Badge>
          </div>
        </section>

        <section>
          <h2>With truncate=true</h2>
          <div style={{ width: 120, border: '1px dashed #aaa', padding: 4 }}>
            <Badge color="blue" truncate={true}>
              This is a very long badge label that should be truncated
            </Badge>
          </div>
        </section>

        <section>
          <h2>Truncate with all colours</h2>
          <div
            style={{
              width: 100,
              border: '1px dashed #aaa',
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {(
              [
                'blue',
                'grey',
                'green',
                'red',
                'severity-critical',
                'severity-high',
                'severity-medium',
                'severity-low',
                'severity-neutral',
              ] as const
            ).map(color => (
              <Badge key={color} color={color} truncate={true}>
                Very long label text
              </Badge>
            ))}
          </div>
        </section>

        <section>
          <h2>Short text (no truncation needed)</h2>
          <div style={{ width: 200, border: '1px dashed #aaa', padding: 4 }}>
            <Badge color="green" truncate={true}>
              Short
            </Badge>
          </div>
        </section>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
