// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import Button from '~components/button';
import SpaceBetween from '~components/space-between';
import Tooltip from '~components/tooltip';

export default function TooltipPositioningDebug() {
  const [showTop, setShowTop] = useState(false);

  return (
    <div style={{ padding: '200px', textAlign: 'center' }}>
      <h1>Tooltip Positioning Debug</h1>

      <SpaceBetween size="xxl">
        <div>
          <h2>Top Position Test</h2>
          <p>The tooltip should appear ABOVE with arrow pointing DOWN</p>
          <Tooltip
            content="This tooltip should be above the button with arrow pointing down"
            position="top"
            open={showTop}
            onOpenChange={setShowTop}
          >
            <Button onClick={() => setShowTop(!showTop)}>Click to Toggle Top Tooltip</Button>
          </Tooltip>
        </div>

        <div>
          <h2>Bootom Position Test</h2>
          <p>The tooltip should appear BELOW with arrow pointing UP</p>
          <Tooltip
            content="The tooltip should appear below with arrow pointing up"
            position="bottom"
            open={showTop}
            onOpenChange={setShowTop}
          >
            <Button onClick={() => setShowTop(!showTop)}>Click to Toggle Top Tooltip</Button>
          </Tooltip>
        </div>

        <div>
          <h2>Left Position Test</h2>
          <p>The tooltip should appear LEFT with arrow pointing RIGHT</p>
          <Tooltip
            content="The tooltip should appear left with arrow pointing right"
            position="left"
            open={showTop}
            onOpenChange={setShowTop}
          >
            <Button onClick={() => setShowTop(!showTop)}>Click to Toggle Top Tooltip</Button>
          </Tooltip>
        </div>

        <div>
          <h2>Right Position Test</h2>
          <p>The tooltip should appear RIGHT with arrow pointing LEFT</p>
          <Tooltip
            content="The tooltip should appear right with arrow pointing left"
            position="right"
            open={showTop}
            onOpenChange={setShowTop}
          >
            <Button onClick={() => setShowTop(!showTop)}>Click to Toggle Top Tooltip</Button>
          </Tooltip>
        </div>
      </SpaceBetween>
    </div>
  );
}
