// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useCallback, useEffect, useState } from 'react';

import { Button, PanelLayout } from '~components';
import SideNavigation, { SideNavigationProps } from '~components/side-navigation';
import { applyTheme } from '~components/theming';
import { colorBackgroundContainerContent, colorBorderDividerDefault } from '~design-tokens';

import { omegaItems } from './new-features.page';
import { generateThemeConfigOneTheme } from './one-theme-config';

const COLLAPSED_SIZE = 75;
const EXPANDED_SIZE = 225;
const MIN_SIZE = COLLAPSED_SIZE;
const MAX_SIZE = 400;
const COLLAPSE_THRESHOLD = 185;
const SNAP_BUFFER = 30;

export default function SideNavigationLayoutPage() {
  const [activeHref, setActiveHref] = useState('#/overview');
  const [panelSize, setPanelSize] = useState(EXPANDED_SIZE);

  const collapsed = panelSize <= COLLAPSED_SIZE;

  useEffect(() => {
    const { reset } = applyTheme({ theme: generateThemeConfigOneTheme() as any });
    return reset;
  }, []);

  const onFollow = useCallback((e: CustomEvent<SideNavigationProps.FollowDetail>) => {
    e.preventDefault();
    setActiveHref(e.detail.href);
  }, []);

  const onPanelResize = useCallback(
    (event: any) => {
      const size = event.detail.panelSize;
      if (collapsed) {
        if (size > COLLAPSED_SIZE + SNAP_BUFFER) {
          setPanelSize(Math.max(size, EXPANDED_SIZE));
        }
      } else {
        if (size < COLLAPSE_THRESHOLD) {
          setPanelSize(COLLAPSED_SIZE);
        } else {
          setPanelSize(size);
        }
      }
    },
    [collapsed]
  );

  const toggleCollapse = useCallback(() => {
    setPanelSize(prev => (prev < COLLAPSE_THRESHOLD ? EXPANDED_SIZE : COLLAPSED_SIZE));
  }, []);

  const containerStyles = {
    backgroundColor: colorBackgroundContainerContent,
    border: `1px solid ${colorBorderDividerDefault}`,
    borderRadius: '8px',
  };

  return (
    <div style={{ blockSize: 'calc(100vh - 40px)' }}>
      <PanelLayout
        panelSize={panelSize}
        onPanelResize={onPanelResize}
        mainFocusable={{ ariaLabel: 'Main content' }}
        maxPanelSize={MAX_SIZE}
        minPanelSize={MIN_SIZE}
        panelFocusable={{ ariaLabel: 'Panel content' }}
        panelPosition="side-start"
        resizable={true}
        mainContent={
          <>
            <div style={{ padding: '16px' }}>
              <a href="#/light/side-navigation/new-features">← Back to feature controls</a>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gridTemplateRows: '90px 200px 200px 160px',
                gap: '16px',
                padding: '24px',
              }}
            >
              <div
                style={{
                  gridColumn: 'span 3',
                  ...containerStyles,
                }}
              />
              <div style={containerStyles} />
              <div style={{ gridColumn: 'span 2', ...containerStyles }} />
              <div style={{ gridColumn: 'span 2', ...containerStyles }} />
              <div style={containerStyles} />
              <div style={containerStyles} />
              <div style={containerStyles} />
              <div style={containerStyles} />
            </div>
          </>
        }
        panelContent={
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minBlockSize: '100%',
              position: 'relative',
            }}
          >
            <div style={{ minInlineSize: 'max-content' }}>
              <SideNavigation
                activeHref={activeHref}
                items={omegaItems}
                expandIconPosition="end"
                collapsed={collapsed}
                variant="highlighted"
                onFollow={onFollow}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                insetBlockEnd: '8px',
                insetInline: 0,
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Button
                iconName={collapsed ? 'angle-right' : 'angle-left'}
                variant="icon"
                onClick={toggleCollapse}
                ariaLabel={collapsed ? 'Expand navigation' : 'Collapse navigation'}
              />
            </div>
          </div>
        }
      />
    </div>
  );
}
