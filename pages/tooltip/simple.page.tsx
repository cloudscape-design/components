// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React from 'react';

import Button from '~components/button';
import SpaceBetween from '~components/space-between';
import Tooltip from '~components/tooltip';

export default function TooltipSimple() {
  return (
    <div style={{ padding: '50px' }}>
      <h1>Tooltip Examples</h1>
      <SpaceBetween size="l">
        <div>
          <h3>Basic Tooltips</h3>
          <SpaceBetween direction="horizontal" size="m">
            <Tooltip content="Top tooltip" position="top">
              <Button>Top</Button>
            </Tooltip>
            <Tooltip content="Right tooltip" position="right">
              <Button>Right</Button>
            </Tooltip>
            <Tooltip content="Bottom tooltip" position="bottom">
              <Button>Bottom</Button>
            </Tooltip>
            <Tooltip content="Left tooltip" position="left">
              <Button>Left</Button>
            </Tooltip>
          </SpaceBetween>
        </div>

        <div>
          <h3>Trigger Types</h3>
          <SpaceBetween direction="horizontal" size="m">
            <Tooltip content="Hover and focus" trigger="hover-focus" position="bottom">
              <Button>Hover & Focus</Button>
            </Tooltip>
            <Tooltip content="Hover only" trigger="hover">
              <Button>Hover Only</Button>
            </Tooltip>
            <Tooltip content="Focus only" trigger="focus">
              <Button>Focus Only</Button>
            </Tooltip>
          </SpaceBetween>
        </div>

        <div>
          <h3>Long Content</h3>
          <Tooltip content="This is a very long tooltip content that should wrap properly and demonstrate how the tooltip handles longer text content with multiple lines.">
            <Button>Long Content</Button>
          </Tooltip>
        </div>

        <div>
          <h3>Delays</h3>
          <SpaceBetween direction="horizontal" size="m">
            <Tooltip content="Fast tooltip" showDelay={0}>
              <Button>No Delay</Button>
            </Tooltip>
            <Tooltip content="Slow tooltip" showDelay={500}>
              <Button>500ms Delay</Button>
            </Tooltip>
          </SpaceBetween>
        </div>
      </SpaceBetween>
    </div>
  );
}
