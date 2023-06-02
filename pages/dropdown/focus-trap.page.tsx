// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Dropdown from '~components/internal/components/dropdown';
import { useState } from 'react';
import { useAppSettings } from '../app/app-context';
import { Box, SpaceBetween, Button } from '~components';

export default function DropdownScenario() {
  const [settings, setSettings] = useAppSettings({
    expandToViewport: true,
    loopFocus: true,
    disableHeader: false,
    disableContent: false,
    disableFooter: false,
  });

  const [isOpen, setIsOpen] = useState(false);

  return (
    <article>
      <h1>Dropdown focus-trap tests</h1>

      <Box margin="m">
        <SpaceBetween direction="vertical" size="m">
          <label>
            <input
              type="checkbox"
              checked={settings.expandToViewport}
              onChange={event => setSettings({ expandToViewport: event.target.checked })}
            />
            expandToViewport
          </label>

          <label>
            <input
              type="checkbox"
              checked={settings.loopFocus}
              onChange={event => setSettings({ loopFocus: event.target.checked })}
            />
            loopFocus
          </label>

          <label>
            <input
              type="checkbox"
              checked={settings.disableHeader}
              onChange={event => setSettings({ disableHeader: event.target.checked })}
            />
            disableHeader
          </label>

          <label>
            <input
              type="checkbox"
              checked={settings.disableFooter}
              onChange={event => setSettings({ disableFooter: event.target.checked })}
            />
            disableFooter
          </label>

          <label>
            <input
              type="checkbox"
              checked={settings.disableContent}
              onChange={event => setSettings({ disableContent: event.target.checked })}
            />
            disableContent
          </label>

          <div id="test-target">
            <Dropdown
              trigger={
                <Button className="trigger" onClick={() => setIsOpen(!isOpen)}>
                  Trigger
                </Button>
              }
              open={isOpen}
              onDropdownClose={() => setIsOpen(false)}
              header={
                <div style={{ padding: 8 }}>
                  <Button disabled={settings.disableHeader}>header-1</Button>
                  <Button disabled={settings.disableHeader}>header-2</Button>
                </div>
              }
              footer={
                <div style={{ padding: 8 }}>
                  <Button disabled={settings.disableFooter}>footer-1</Button>
                  <Button disabled={settings.disableFooter}>footer-2</Button>
                </div>
              }
              expandToViewport={settings.expandToViewport}
              loopFocus={settings.loopFocus}
            >
              <div style={{ padding: 8 }}>
                <Button disabled={settings.disableContent}>content-1</Button>
                <Button disabled={settings.disableContent}>content-2</Button>
              </div>
            </Dropdown>
          </div>
        </SpaceBetween>
      </Box>
    </article>
  );
}
