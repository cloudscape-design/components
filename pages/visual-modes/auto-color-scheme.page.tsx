// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import * as React from 'react';

import Alert from '~components/alert';
import Badge from '~components/badge';
import Box from '~components/box';
import Button from '~components/button';
import SpaceBetween from '~components/space-between';

import ScreenshotArea from '../utils/screenshot-area';

/**
 * Dev page for the `.awsui-auto-mode` CSS class feature (issue #4128).
 *
 * `.awsui-auto-mode` wraps dark-mode token overrides in
 * `@media (prefers-color-scheme: dark)` so SSR apps can avoid theme flash
 * without any JavaScript — just add the class to the root element at build time.
 *
 * Compare with `.awsui-dark-mode` which requires JS to toggle.
 */
export default function AutoColorSchemePage() {
  const [mode, setMode] = React.useState<'none' | 'dark' | 'auto'>('none');

  const className = mode === 'dark' ? 'awsui-dark-mode' : mode === 'auto' ? 'awsui-auto-mode' : undefined;

  return (
    <ScreenshotArea>
      <h1>Visual modes — auto-mode CSS class</h1>

      <SpaceBetween size="m">
        <Alert type="info">
          <strong>.awsui-auto-mode</strong> applies dark tokens only when the OS prefers dark via{' '}
          <code>@media (prefers-color-scheme: dark)</code>. No JavaScript required — ideal for SSR.
          <br />
          <strong>.awsui-dark-mode</strong> always applies dark tokens regardless of OS preference (requires JS to set
          the class).
        </Alert>

        <SpaceBetween direction="horizontal" size="s">
          <Button onClick={() => setMode('none')} variant={mode === 'none' ? 'primary' : 'normal'}>
            No mode class
          </Button>
          <Button onClick={() => setMode('dark')} variant={mode === 'dark' ? 'primary' : 'normal'}>
            .awsui-dark-mode
          </Button>
          <Button onClick={() => setMode('auto')} variant={mode === 'auto' ? 'primary' : 'normal'}>
            .awsui-auto-mode
          </Button>
        </SpaceBetween>

        <div className={className} style={{ padding: 16, border: '1px solid #ccc', borderRadius: 4 }}>
          <SpaceBetween size="m">
            <Box variant="h2">
              Active class: <code>{className ?? '(none)'}</code>
            </Box>
            <Box>
              This container has <code>{className ?? 'no mode class'}</code> applied.
              {mode === 'auto' && (
                <>
                  {' '}
                  Dark tokens are applied only when your OS is in dark mode (check your system settings to see the
                  effect).
                </>
              )}
              {mode === 'dark' && <> Dark tokens are always applied regardless of OS preference.</>}
            </Box>
            <SpaceBetween direction="horizontal" size="s">
              <Badge color="blue">Blue badge</Badge>
              <Badge color="green">Green badge</Badge>
              <Badge color="red">Red badge</Badge>
              <Badge color="grey">Grey badge</Badge>
            </SpaceBetween>
            <Button variant="primary">Primary button</Button>
            <Alert type="success">Success alert inside the mode container</Alert>
          </SpaceBetween>
        </div>
      </SpaceBetween>
    </ScreenshotArea>
  );
}
