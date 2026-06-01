// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useState } from 'react';

import { Box, SpaceBetween, Toggle } from '~components';
import Drawer from '~components/drawer';

import { SimplePage } from '../app/templates';

export default function DrawerResizablePage() {
  const [size, setSize] = useState(300);
  const [endSize, setEndSize] = useState(350);
  const [startOpen, setStartOpen] = useState(true);
  const [endOpen, setEndOpen] = useState(true);
  const [resizable, setResizable] = useState(true);

  return (
    <SimplePage
      title="Resizable drawers"
      settings={
        <SpaceBetween size="m" direction="horizontal">
          <Toggle checked={startOpen} onChange={({ detail }) => setStartOpen(detail.checked)}>
            Start drawer
          </Toggle>
          <Toggle checked={endOpen} onChange={({ detail }) => setEndOpen(detail.checked)}>
            End drawer
          </Toggle>
          <Toggle checked={resizable} onChange={({ detail }) => setResizable(detail.checked)}>
            Resizable
          </Toggle>
        </SpaceBetween>
      }
    >
      <div
        style={{
          display: 'flex',
          blockSize: 'calc(100vh - 200px)',
          overflow: 'hidden',
          border: '2px solid light-dark(black, white)',
        }}
      >
        <Drawer
          header="Start drawer"
          open={startOpen}
          onClose={() => setStartOpen(false)}
          closeAction={{ ariaLabel: 'Close start drawer' }}
          placement="start"
          resizable={resizable}
          size={size}
          minSize={200}
          maxSize={500}
          onResize={({ detail }) => setSize(detail.size)}
        >
          <SpaceBetween size="m">
            <Box>Resizable drawer on the start side.</Box>
            <Box variant="small">Current size: {size}px</Box>
          </SpaceBetween>
        </Drawer>

        <div style={{ flex: 1, padding: '24px', overflow: 'auto', background: 'light-dark(lavender, slateblue)' }}>
          <Box>Main content area. The drawers on either side are resizable.</Box>
        </div>

        <Drawer
          header="End drawer"
          open={endOpen}
          onClose={() => setEndOpen(false)}
          closeAction={{ ariaLabel: 'Close end drawer' }}
          placement="end"
          resizable={resizable}
          size={endSize}
          minSize={200}
          maxSize={600}
          onResize={({ detail }) => setEndSize(detail.size)}
        >
          <SpaceBetween size="m">
            <Box>Resizable drawer on the end side.</Box>
            <Box variant="small">Current size: {endSize}px</Box>
          </SpaceBetween>
        </Drawer>
      </div>
    </SimplePage>
  );
}
