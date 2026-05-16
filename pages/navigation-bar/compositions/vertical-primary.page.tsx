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

type PageContext = React.Context<
  AppContextType<{
    primaryStart: boolean;
    primaryEnd: boolean;
    secondaryStart: boolean;
    secondaryEnd: boolean;
    top: boolean;
    bottom: boolean;
    darkMode: boolean;
  }>
>;

export default function VerticalPrimaryPage() {
  const {
    urlParams: { primaryStart, primaryEnd, secondaryStart, secondaryEnd, top, bottom, darkMode },
    setUrlParams,
  } = useContext(AppContext as PageContext);

  const showPrimaryStart = primaryStart !== false;
  const showPrimaryEnd = primaryEnd === true;
  const showSecondaryStart = secondaryStart === true;
  const showSecondaryEnd = secondaryEnd === true;
  const showTop = top !== false;
  const showBottom = bottom === true;

  return (
    <div style={{ display: 'flex', height: 'calc(100dvh - var(--app-header-height, 40px))' }}>
      {showPrimaryStart && (
        <NavigationBar
          placement="start"
          variant={darkMode ? 'primary-accent' : 'primary'}
          ariaLabel="Left navigation"
          content={primaryVerticalContent}
        />
      )}
      {showSecondaryStart && (
        <NavigationBar
          placement="start"
          variant="secondary"
          ariaLabel="Left tools"
          content={secondaryVerticalContent}
        />
      )}
      <div style={layoutStyles.column}>
        {showTop && (
          <NavigationBar
            placement="top"
            variant="secondary"
            ariaLabel="Top toolbar"
            content={secondaryHorizontalContent}
          />
        )}
        <div style={layoutStyles.scrollable}>
          <Box variant="h1">NavigationBar — Vertical primary</Box>
          <SpaceBetween size="m">
            <SpaceBetween size="m" direction="horizontal">
              <Toggle
                checked={showPrimaryStart}
                onChange={({ detail }) => setUrlParams({ primaryStart: detail.checked })}
              >
                Primary left
              </Toggle>
              <Toggle checked={showPrimaryEnd} onChange={({ detail }) => setUrlParams({ primaryEnd: detail.checked })}>
                Primary right
              </Toggle>
              <Toggle
                checked={showSecondaryStart}
                onChange={({ detail }) => setUrlParams({ secondaryStart: detail.checked })}
              >
                Secondary left
              </Toggle>
              <Toggle
                checked={showSecondaryEnd}
                onChange={({ detail }) => setUrlParams({ secondaryEnd: detail.checked })}
              >
                Secondary right
              </Toggle>
              <Toggle checked={showTop} onChange={({ detail }) => setUrlParams({ top: detail.checked })}>
                Secondary top
              </Toggle>
              <Toggle checked={showBottom} onChange={({ detail }) => setUrlParams({ bottom: detail.checked })}>
                Secondary bottom
              </Toggle>
            </SpaceBetween>
            <Toggle checked={darkMode === true} onChange={({ detail }) => setUrlParams({ darkMode: detail.checked })}>
              primary-accent
            </Toggle>
            <div>{filler}</div>
          </SpaceBetween>
        </div>
        {showBottom && (
          <NavigationBar
            placement="bottom"
            variant="secondary"
            ariaLabel="Bottom toolbar"
            content={secondaryHorizontalContent}
          />
        )}
      </div>
      {showSecondaryEnd && (
        <NavigationBar placement="end" variant="secondary" ariaLabel="Right tools" content={secondaryVerticalContent} />
      )}
      {showPrimaryEnd && (
        <NavigationBar
          placement="end"
          variant={darkMode ? 'primary-accent' : 'primary'}
          ariaLabel="Right navigation"
          content={primaryVerticalContent}
        />
      )}
    </div>
  );
}
