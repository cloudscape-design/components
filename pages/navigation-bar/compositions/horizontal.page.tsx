// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';

import Box from '~components/box';
import NavigationBar from '~components/navigation-bar';
import SpaceBetween from '~components/space-between';
import Toggle from '~components/toggle';

import AppContext, { AppContextType } from '../../app/app-context';
import { filler, layoutStyles, primaryHorizontalContent, secondaryHorizontalContent } from '../common';

type PageContext = React.Context<AppContextType<{ darkMode: boolean }>>;

export default function HorizontalCompositionPage() {
  const {
    urlParams: { darkMode },
    setUrlParams,
  } = useContext(AppContext as PageContext);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - var(--app-header-height, 40px))' }}>
      <NavigationBar
        variant={darkMode ? 'primary-accent' : 'primary'}
        ariaLabel="Primary navigation"
        content={primaryHorizontalContent}
      />
      <NavigationBar variant="secondary" ariaLabel="Toolbar" content={secondaryHorizontalContent} />
      <div style={layoutStyles.scrollable}>
        <Box variant="h1">NavigationBar — Horizontal composition</Box>
        <SpaceBetween size="s">
          <Toggle checked={darkMode === true} onChange={({ detail }) => setUrlParams({ darkMode: detail.checked })}>
            primary-accent variant
          </Toggle>
        </SpaceBetween>
        <Box padding={{ top: 'm' }}>{filler}</Box>
      </div>
    </div>
  );
}
