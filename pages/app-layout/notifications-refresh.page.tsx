// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout from '~components/app-layout';
import Box from '~components/box';
import Button from '~components/button';
import Flashbar from '~components/flashbar';

import { Breadcrumbs, Navigation, Tools } from './utils/content-blocks';
import labels from './utils/labels';
import * as toolsContent from './utils/tools-content';

export default function () {
  const [maxContentWidth, setMaxContentWidth] = useState<number | undefined>(undefined);
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  return (
    <AppLayout
      ariaLabels={labels}
      notifications={
        <Flashbar items={[{ type: 'success', header: 'Success message', statusIconAriaLabel: 'success' }]} />
      }
      navigation={<Navigation />}
      navigationOpen={navigationOpen}
      onNavigationChange={e => setNavigationOpen(e.detail.open)}
      tools={<Tools>{toolsContent.long}</Tools>}
      toolsOpen={toolsOpen}
      onToolsChange={e => setToolsOpen(e.detail.open)}
      breadcrumbs={<Breadcrumbs />}
      maxContentWidth={maxContentWidth}
      content={
        <div className="content" style={{ width: maxContentWidth || '100%' }}>
          <Box variant="h1">Demo page for notifications width in visual refresh</Box>
          <Button
            className="width-400"
            onClick={() => {
              setMaxContentWidth(400);
            }}
          >
            Set content width to 400
          </Button>
          <Button
            className="width-800"
            onClick={() => {
              setMaxContentWidth(800);
            }}
          >
            Set content width to 800
          </Button>
          <Button
            className="width-2000"
            onClick={() => {
              setMaxContentWidth(2000);
            }}
          >
            Set content width to 2000
          </Button>
          <Button
            className="navigation-toggle"
            onClick={() => {
              setNavigationOpen(!navigationOpen);
            }}
          >
            Toggle navigation
          </Button>
          <Button
            className="tools-toggle"
            onClick={() => {
              setToolsOpen(!toolsOpen);
            }}
          >
            Toggle tools
          </Button>
        </div>
      }
    />
  );
}
