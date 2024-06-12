// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';
import AppLayout from '~components/app-layout';
import Header from '~components/header';
import ScreenshotArea from '../utils/screenshot-area';
import { Containers, Breadcrumbs } from './utils/content-blocks';
import labels from './utils/labels';
import SplitPanel from '~components/split-panel';

export default function () {
  const [splitPanelOpen, setSplitPanelOpen] = useState(true);

  const [customNavOpen, setCustomNavOpen] = useState(true);
  const customNavWidth = customNavOpen ? 300 : 100;

  const [customToolsOpen, setCustomToolsOpen] = useState(true);
  const customToolsWidth = customToolsOpen ? 300 : 100;

  return (
    <ScreenshotArea gutters={false}>
      <div>
        <nav
          aria-label="Custom side navigation"
          style={{
            backgroundColor: 'orange',
            inlineSize: customNavWidth,
            color: 'black',
            position: 'fixed',
            boxSizing: 'border-box',
            insetBlockEnd: 0,
            insetBlockStart: 0,
            paddingBlock: 10,
            paddingInline: 10,
            paddingBlockStart: 70,
            zIndex: 900,
          }}
        >
          <button onClick={() => setCustomNavOpen(!customNavOpen)}>Toggle custom navigation</button>
          <p>This is a custom side navigation. It is implemented outside of the App Layout.</p>
          <p>The App Layout should still display correctly. It should not overlap with this side navigation.</p>

          <p>The split panel should stay inside the AppLayout&apos;s area.</p>
        </nav>
        <div style={{ paddingInlineStart: customNavWidth, paddingInlineEnd: customToolsWidth }}>
          <AppLayout
            ariaLabels={labels}
            breadcrumbs={<Breadcrumbs />}
            navigationHide={true}
            toolsHide={true}
            splitPanelOpen={splitPanelOpen}
            onSplitPanelToggle={e => setSplitPanelOpen(e.detail.open)}
            content={
              <>
                <div style={{ marginBlockEnd: '1rem' }}>
                  <Header variant="h1" description="Basic demo">
                    Demo page
                  </Header>
                </div>
                <Containers />
              </>
            }
            splitPanel={
              <SplitPanel
                header="Split panel header"
                i18nStrings={{
                  preferencesTitle: 'Preferences',
                  preferencesPositionLabel: 'Split panel position',
                  preferencesPositionDescription: 'Choose the default split panel position for the service.',
                  preferencesPositionSide: 'Side',
                  preferencesPositionBottom: 'Bottom',
                  preferencesConfirm: 'Confirm',
                  preferencesCancel: 'Cancel',
                  closeButtonAriaLabel: 'Close panel',
                  openButtonAriaLabel: 'Open panel',
                  resizeHandleAriaLabel: 'Slider',
                }}
              >
                This is some placeholder content for the split panel content area.
              </SplitPanel>
            }
          />
        </div>
        <nav
          aria-label="Custom tools panel"
          style={{
            backgroundColor: 'orange',
            inlineSize: customToolsWidth,
            color: 'black',
            position: 'fixed',
            boxSizing: 'border-box',
            insetBlockEnd: 0,
            insetBlockStart: 0,
            insetInlineEnd: 0,
            paddingBlock: 10,
            paddingInline: 10,
            paddingBlockStart: 70,
            zIndex: 900,
          }}
        >
          <button onClick={() => setCustomToolsOpen(!customToolsOpen)}>Toggle custom tools</button>
          <p>This is a custom tools panel. It is implemented outside of the App Layout.</p>
          <p>The App Layout should still display correctly. It should not overlap with this tools panel.</p>

          <p>The split panel should stay inside the AppLayout&apos;s area.</p>
        </nav>
      </div>
    </ScreenshotArea>
  );
}
