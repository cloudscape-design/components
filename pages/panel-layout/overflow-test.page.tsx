// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext, useState } from 'react';

import { Box, Button, SpaceBetween } from '~components';
import PanelLayout, { PanelLayoutProps } from '~components/panel-layout';
import { colorBackgroundCellShaded } from '~design-tokens';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';
import { DisplaySetting } from './common';

type PageContext = React.Context<
  AppContextType<{
    display: PanelLayoutProps.Display;
  }>
>;

const panelStyles: React.CSSProperties = {
  background: colorBackgroundCellShaded,
  height: 300,
  minWidth: 400,
  padding: 16,
  boxSizing: 'border-box',
};

export default function StandalonePanelLayoutPage() {
  const {
    urlParams: { display = 'all' },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  const [panelSize, setPanelSize] = useState(300);
  const [totalSize, setTotalSize] = useState(600);
  return (
    <SimplePage
      title="Panel Layout overflow test page"
      i18n={{}}
      screenshotArea={{}}
      settings={<DisplaySetting value={display} onChange={value => setUrlParams({ display: value })} />}
    >
      <div style={{ maxWidth: display === 'all' ? 600 : 300 }}>
        <PanelLayout
          resizable={true}
          scrollable={true}
          minPanelSize={100}
          panelSize={panelSize}
          maxPanelSize={500}
          onPanelResize={({ detail }) => {
            setPanelSize(detail.panelSize);
            setTotalSize(detail.totalSize);
          }}
          display={display}
          panelPosition="side-end"
          panelContent={
            <div style={panelStyles}>
              <SpaceBetween size="xs">
                <Box>Panel size: {panelSize.toFixed(0)}px</Box>
                <Box>Content size: 400px</Box>
                <Button>Focus</Button>
              </SpaceBetween>
            </div>
          }
          mainContent={
            <div style={panelStyles}>
              <SpaceBetween size="xs">
                <Box>Main size: {(totalSize - panelSize).toFixed(0)}px</Box>
                <Box>Content size: 400px</Box>
                <Button>Focus</Button>
              </SpaceBetween>
            </div>
          }
        />
      </div>
    </SimplePage>
  );
}
