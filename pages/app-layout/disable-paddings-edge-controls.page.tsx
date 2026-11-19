// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useState } from 'react';

import AppLayout from '~components/app-layout';
import Box from '~components/box';
import Button from '~components/button';
import SplitPanel from '~components/split-panel';

import ScreenshotArea from '../utils/screenshot-area';
import labels from './utils/labels';
import { splitPaneli18nStrings } from './utils/strings';

export default function () {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const addEvent = (text: string) => setEvents(events => [...events, text]);

  return (
    <ScreenshotArea gutters={false}>
      <AppLayout
        ariaLabels={labels}
        disableContentPaddings={true}
        notifications={<Box variant="h2">Notifications</Box>}
        navigationOpen={navigationOpen}
        onNavigationChange={({ detail }) => setNavigationOpen(detail.open)}
        toolsOpen={toolsOpen}
        onToolsChange={({ detail }) => setToolsOpen(detail.open)}
        splitPanelPreferences={{ position: 'side' }}
        onSplitPanelPreferencesChange={() => {}}
        navigation={
          <>
            <Box variant="h2">Navigation</Box>
            <Button data-testid="navigation" onClick={() => addEvent('Clicked "Navigation"')}>
              Navigation
            </Button>
          </>
        }
        tools={
          <>
            <Box variant="h2">Tools</Box>
            <Button data-testid="tools" onClick={() => addEvent('Clicked "Tools"')}>
              Tools
            </Button>
          </>
        }
        splitPanel={
          <SplitPanel i18nStrings={splitPaneli18nStrings} header="Split panel">
            <Button data-testid="split-panel" onClick={() => addEvent('Clicked "Split panel"')}>
              Split panel
            </Button>
          </SplitPanel>
        }
        content={
          <>
            <Box variant="h1">Edge controls test</Box>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button data-testid="one" onClick={() => addEvent('Clicked "One"')}>
                One
              </Button>
              <Button data-testid="two" onClick={() => addEvent('Clicked "Two"')}>
                Two
              </Button>
            </div>
            <ul id="events">
              {events.map((event, i) => (
                <li key={i}>{event}</li>
              ))}
            </ul>
          </>
        }
      />
    </ScreenshotArea>
  );
}
