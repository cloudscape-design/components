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
  primaryHorizontalContent,
  secondaryHorizontalContent,
  secondaryVerticalContent,
} from '../common';

type PageContext = React.Context<
  AppContextType<{
    primaryTop: boolean;
    primaryBottom: boolean;
    secondaryTop: boolean;
    secondaryBottom: boolean;
    left: boolean;
    right: boolean;
    darkMode: boolean;
  }>
>;

export default function HorizontalPrimaryPage() {
  const {
    urlParams: { primaryTop, primaryBottom, secondaryTop, secondaryBottom, left, right, darkMode },
    setUrlParams,
  } = useContext(AppContext as PageContext);

  const showPrimaryTop = primaryTop !== false;
  const showPrimaryBottom = primaryBottom === true;
  const showSecondaryTop = secondaryTop !== false;
  const showSecondaryBottom = secondaryBottom === true;
  const showLeft = left !== false;
  const showRight = right === true;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - var(--app-header-height, 40px))' }}>
      {showPrimaryTop && (
        <NavigationBar
          placement="top"
          variant={darkMode ? 'primary-accent' : 'primary'}
          ariaLabel="Top navigation"
          content={primaryHorizontalContent}
        />
      )}
      {showSecondaryTop && (
        <NavigationBar
          placement="top"
          variant="secondary"
          ariaLabel="Secondary toolbar"
          content={secondaryHorizontalContent}
        />
      )}
      <div style={layoutStyles.row}>
        {showLeft && (
          <NavigationBar
            placement="start"
            variant="secondary"
            ariaLabel="Left navigation"
            content={secondaryVerticalContent}
          />
        )}
        <div style={layoutStyles.scrollable}>
          <Box variant="h1">NavigationBar — Horizontal primary</Box>
          <SpaceBetween size="m">
            <SpaceBetween size="m" direction="horizontal">
              <Toggle checked={showPrimaryTop} onChange={({ detail }) => setUrlParams({ primaryTop: detail.checked })}>
                Primary top
              </Toggle>
              <Toggle
                checked={showPrimaryBottom}
                onChange={({ detail }) => setUrlParams({ primaryBottom: detail.checked })}
              >
                Primary bottom
              </Toggle>
              <Toggle
                checked={showSecondaryTop}
                onChange={({ detail }) => setUrlParams({ secondaryTop: detail.checked })}
              >
                Secondary top
              </Toggle>
              <Toggle
                checked={showSecondaryBottom}
                onChange={({ detail }) => setUrlParams({ secondaryBottom: detail.checked })}
              >
                Secondary bottom
              </Toggle>
              <Toggle checked={showLeft} onChange={({ detail }) => setUrlParams({ left: detail.checked })}>
                Left
              </Toggle>
              <Toggle checked={showRight} onChange={({ detail }) => setUrlParams({ right: detail.checked })}>
                Right
              </Toggle>
            </SpaceBetween>
            <Toggle checked={darkMode === true} onChange={({ detail }) => setUrlParams({ darkMode: detail.checked })}>
              primary-accent
            </Toggle>
            <div>{filler}</div>
          </SpaceBetween>
        </div>
        {showRight && (
          <NavigationBar
            placement="end"
            variant="secondary"
            ariaLabel="Right navigation"
            content={secondaryVerticalContent}
          />
        )}
      </div>
      {showSecondaryBottom && (
        <NavigationBar
          placement="bottom"
          variant="secondary"
          ariaLabel="Secondary bottom toolbar"
          content={secondaryHorizontalContent}
        />
      )}
      {showPrimaryBottom && (
        <NavigationBar
          placement="bottom"
          variant={darkMode ? 'primary-accent' : 'primary'}
          ariaLabel="Bottom navigation"
          content={primaryHorizontalContent}
        />
      )}
    </div>
  );
}
