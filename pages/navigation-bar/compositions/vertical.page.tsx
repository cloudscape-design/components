// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import Box from '~components/box';
import NavigationBar from '~components/navigation-bar';
import SpaceBetween from '~components/space-between';
import Toggle from '~components/toggle';

import AppContext, { AppContextType } from '../../app/app-context';
import {
  filler,
  layoutStyles,
  primaryVerticalContent,
  secondaryHorizontalContent,
  secondaryVerticalContent,
} from '../common';

type PageContext = React.Context<AppContextType<{ darkMode: boolean; showSecondaryTop: boolean }>>;

export default function VerticalCompositionPage() {
  const {
    urlParams: { darkMode, showSecondaryTop },
    setUrlParams,
  } = useContext(AppContext as PageContext);

  return (
    <div style={{ display: 'flex', height: 'calc(100dvh - var(--app-header-height, 40px))' }}>
      <NavigationBar
        variant={darkMode ? 'primary-accent' : 'primary'}
        placement="start"
        ariaLabel="Primary navigation"
        content={primaryVerticalContent}
      />
      <NavigationBar
        variant="secondary"
        placement="start"
        ariaLabel="Secondary sidebar"
        content={secondaryVerticalContent}
      />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        {showSecondaryTop !== false && (
          <NavigationBar variant="secondary" ariaLabel="Toolbar" content={secondaryHorizontalContent} />
        )}
        <div style={layoutStyles.scrollable}>
          <Box variant="h1">NavigationBar — Vertical composition</Box>
          <SpaceBetween size="s">
            <Toggle checked={darkMode === true} onChange={({ detail }) => setUrlParams({ darkMode: detail.checked })}>
              primary-accent variant
            </Toggle>
            <Toggle
              checked={showSecondaryTop !== false}
              onChange={({ detail }) => setUrlParams({ showSecondaryTop: detail.checked })}
            >
              Show secondary top toolbar
            </Toggle>
          </SpaceBetween>
          <Box padding={{ top: 'm' }}>{filler}</Box>
        </div>
      </div>
    </div>
  );
}
