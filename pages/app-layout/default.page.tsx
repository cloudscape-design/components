// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useState } from 'react';

import { AppLayout, Checkbox, Header, SpaceBetween, Toggle } from '~components';

import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Containers, Navigation, Tools } from './utils/content-blocks';
import labels from './utils/labels';
import * as toolsContent from './utils/tools-content';

export default function () {
  const [withControlledTools, setWithControlledTools] = useState<boolean>(false);
  const [controlledToolsOpen, setControlledToolesOpen] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    if (!withControlledTools && controlledToolsOpen !== undefined) {
      setControlledToolesOpen(undefined);
    } else if (withControlledTools && controlledToolsOpen === undefined) {
      setControlledToolesOpen(false);
    }
  }, [controlledToolsOpen, withControlledTools]);

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        analyticsMetadata={{
          flowType: 'home',
          instanceIdentifier: 'demo-page',
        }}
        breadcrumbs={<Breadcrumbs />}
        navigation={<Navigation />}
        tools={<Tools>{toolsContent.long}</Tools>}
        toolsOpen={controlledToolsOpen}
        content={
          <>
            <div style={{ marginBlockEnd: '1rem' }}>
              <SpaceBetween size="m">
                <Header variant="h1" description="Basic demo">
                  Demo page
                </Header>

                <Toggle
                  checked={withControlledTools}
                  onChange={({ detail }) => setWithControlledTools(detail.checked)}
                  data-id="controlled toggle"
                >
                  Controlled ToolsOpen <small>- sets toolsOpen prop to undefined</small>
                </Toggle>
                <SpaceBetween direction="vertical" size="xs">
                  <Checkbox
                    checked={controlledToolsOpen !== undefined && controlledToolsOpen}
                    onChange={event => setControlledToolesOpen(event.detail.checked)}
                    disabled={!withControlledTools}
                  >
                    Set Controlled ToolsOpen
                  </Checkbox>
                </SpaceBetween>
              </SpaceBetween>
            </div>
            <Containers />
          </>
        }
      />
    </ScreenshotArea>
  );
}
