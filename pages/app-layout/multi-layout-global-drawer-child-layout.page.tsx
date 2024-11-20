// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect } from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';

import AppLayout from '~components/app-layout';
import Header from '~components/header';
import ScreenreaderOnly from '~components/internal/components/screenreader-only';
import awsuiPlugins from '~components/internal/plugins';
import Link from '~components/link';
import SpaceBetween from '~components/space-between';

import { IframeWrapper } from '../utils/iframe-wrapper';
import ScreenshotArea from '../utils/screenshot-area';
import { Breadcrumbs, Containers, Navigation, Tools } from './utils/content-blocks';
import labels from './utils/labels';
import * as toolsContent from './utils/tools-content';

function InnerApp() {
  useEffect(() => {
    awsuiPlugins.appLayout.registerDrawer({
      id: 'circle-global',
      type: 'global',
      defaultActive: true,
      resizable: true,
      defaultSize: 320,

      ariaLabels: {
        closeButton: 'Close button',
        content: 'Content',
        triggerButton: 'Trigger button',
        resizeHandle: 'Resize handle',
      },

      trigger: {
        iconSvg: `<svg viewBox="0 0 16 16" focusable="false">
      <circle stroke-width="2" stroke="currentColor" fill="none" cx="8" cy="8" r="7" />
      <circle stroke-width="2" stroke="currentColor" fill="none" cx="8" cy="8" r="3" />
    </svg>`,
      },

      mountContent: container => {
        ReactDOM.render(<div>global widget content circle 2</div>, container);
      },
      unmountContent: container => unmountComponentAtNode(container),
    });
  }, []);

  return (
    <AppLayout
      data-testid="secondary-layout"
      ariaLabels={labels}
      breadcrumbs={<Breadcrumbs />}
      navigationHide={true}
      content={
        <SpaceBetween size="s">
          <Header variant="h1" description="This page contains nested app layout instances with an iframe">
            Multiple app layouts with iframe
          </Header>

          <Link external={true} href="#">
            External link
          </Link>

          <Containers />
        </SpaceBetween>
      }
      tools={<Tools>{toolsContent.long}</Tools>}
    />
  );
}

export default function () {
  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        {...{ __disableRuntimeDrawers: true }}
        data-testid="main-layout"
        ariaLabels={labels}
        navigation={<Navigation />}
        toolsHide={true}
        disableContentPaddings={true}
        content={
          <>
            <ScreenreaderOnly>
              <h1>Multiple app layouts with iframe</h1>
            </ScreenreaderOnly>
            <IframeWrapper id="inner-iframe" AppComponent={InnerApp} />
          </>
        }
      />
    </ScreenshotArea>
  );
}
