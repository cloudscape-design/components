// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout, { AppLayoutProps } from '~components/app-layout';
import Box from '~components/box';
import Header from '~components/header';
import SpaceBetween from '~components/space-between';
import SplitPanel from '~components/split-panel';

import ScreenshotArea from '../utils/screenshot-area';
import { splitPaneli18nStrings } from './utils/strings';

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" aria-hidden="true">
    <path d="M8 1l1.9 3.8 4.2.6-3 3 .7 4.2L8 10.5 4.2 12.6l.7-4.2-3-3 4.2-.6z" />
  </svg>
);

const ChevronIcon = ({ direction }: { direction: 'up' | 'down' | 'left' | 'right' }) => {
  const paths: Record<string, string> = {
    up: 'M2 11l6-6 6 6',
    down: 'M2 5l6 6 6-6',
    left: 'M11 2L5 8l6 6',
    right: 'M5 2l6 6-6 6',
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" aria-hidden="true">
      <polyline points={paths[direction]} fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};

export default function App() {
  const [splitPanelOpen, setSplitPanelOpen] = useState(true);
  const [splitPanelPosition, setSplitPanelPosition] =
    useState<AppLayoutProps.SplitPanelPreferences['position']>('bottom');

  return (
    <ScreenshotArea>
      <AppLayout
        content={
          <Box padding="l">
            <SpaceBetween size="l">
              <Header headingTagOverride="h1">SplitPanel — custom toggle icon demo</Header>
              <Box>
                Toggle the split panel open/closed. The open and close buttons use custom SVG icons instead of the
                built-in Cloudscape icons.
              </Box>
            </SpaceBetween>
          </Box>
        }
        splitPanel={
          <SplitPanel
            header="Custom toggle icon"
            i18nStrings={splitPaneli18nStrings}
            toggleIconOpen={<ChevronIcon direction={splitPanelPosition === 'side' ? 'right' : 'down'} />}
            toggleIconClosed={<StarIcon />}
          >
            <Box>
              This split panel uses custom SVG icons for its toggle button. The close icon is a custom chevron and the
              open icon is a star.
            </Box>
          </SplitPanel>
        }
        splitPanelOpen={splitPanelOpen}
        splitPanelPreferences={{ position: splitPanelPosition }}
        onSplitPanelToggle={({ detail }) => setSplitPanelOpen(detail.open)}
        onSplitPanelPreferencesChange={({ detail }) => setSplitPanelPosition(detail.position)}
      />
    </ScreenshotArea>
  );
}
