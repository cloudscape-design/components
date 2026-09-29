// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useEffect, useRef, useState } from 'react';

import { applyMode, Mode } from '@cloudscape-design/global-styles';

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  Flashbar,
  Header,
  Link,
  SpaceBetween,
  StatusIndicator,
} from '~components';
import { applyTheme, Theme } from '~components/theming';

import ScreenshotArea from '../utils/screenshot-area';
import scopedTheme from './scoped-theme.json';

const SCOPE_CLASS = 'scoped-theme-demo';

function DemoContent() {
  return (
    <SpaceBetween size="m">
      <SpaceBetween direction="horizontal" size="s" alignItems="center">
        <Button variant="primary">Primary button</Button>
        <Button variant="normal">Secondary button</Button>
        <Button variant="link">Tertiary button</Button>
        <Link href="#">Learn more</Link>
        <StatusIndicator type="success">Success</StatusIndicator>
      </SpaceBetween>
      <Flashbar
        items={[
          { type: 'success', header: 'Deployment succeeded', statusIconAriaLabel: 'success' },
          { type: 'info', header: 'New version available', statusIconAriaLabel: 'info' },
        ]}
      />
      <Alert type="info" header="Info alert">
        Themed alert visual context.
      </Alert>
      <Alert type="success" header="Success alert">
        Themed alert visual context.
      </Alert>
    </SpaceBetween>
  );
}

export default function ScopedThemePage() {
  const [themeEnabled, setThemeEnabled] = useState(true);
  const [scopedDarkMode, setScopedDarkMode] = useState(false);
  const scopeRef = useRef<HTMLDivElement>(null);

  // Scoped runtime theming: the stylesheet is self-contained and applies only
  // within elements matching the selector. The base theme (cascade layer)
  // keeps supplying every token the theme does not define.
  useEffect(() => {
    if (!themeEnabled) {
      setScopedDarkMode(false);
      return;
    }
    const { reset } = applyTheme({ theme: scopedTheme as Theme, selector: `.${SCOPE_CLASS}` });
    return reset;
  }, [themeEnabled]);

  // Modes compose on the scope element itself: applyMode must target the same
  // element that carries the scope selector.
  useEffect(() => {
    if (scopeRef.current) {
      applyMode(scopedDarkMode ? Mode.Dark : null, scopeRef.current);
    }
  }, [scopedDarkMode]);

  return (
    <Box padding="l">
      <h1>Scoped theming (theming v2)</h1>
      <SpaceBetween size="l">
        <SpaceBetween direction="horizontal" size="l">
          <Checkbox checked={themeEnabled} onChange={({ detail }) => setThemeEnabled(detail.checked)}>
            Apply scoped theme
          </Checkbox>
          <Checkbox
            checked={scopedDarkMode}
            onChange={({ detail }) => setScopedDarkMode(detail.checked)}
            disabled={!themeEnabled}
          >
            Dark mode inside scope
          </Checkbox>
        </SpaceBetween>
        <ScreenshotArea>
          <SpaceBetween size="l">
            <Container header={<Header variant="h2">Outside scope — base theme</Header>}>
              <DemoContent />
            </Container>
            <div ref={scopeRef} className={SCOPE_CLASS}>
              <Container header={<Header variant="h2">Inside scope — custom theme</Header>}>
                <DemoContent />
              </Container>
            </div>
          </SpaceBetween>
        </ScreenshotArea>
      </SpaceBetween>
    </Box>
  );
}
