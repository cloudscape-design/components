// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
import React, { useContext, useState } from 'react';

import { Box, Checkbox, Drawer, FormField, Header, Input, SegmentedControl, SpaceBetween } from '~components';
import AppLayout from '~components/app-layout';
import Button from '~components/button';
import { I18nProvider } from '~components/i18n';
import messages from '~components/i18n/messages/all.en';
import PanelLayout, { PanelLayoutProps } from '~components/panel-layout';

import AppContext, { AppContextType } from '../app/app-context';
import labels from '../app-layout/utils/labels';
import ScreenshotArea from '../utils/screenshot-area';

interface PanelLayoutContentProps {
  longPanelContent: boolean;
  longMainContent: boolean;
  buttons: boolean;
  minPanelSize: number;
  maxPanelSize: number;
  minContentSize: number;
  display: PanelLayoutProps.Display;
  panelPosition: PanelLayoutProps.PanelPosition;
}
type PageContext = React.Context<AppContextType<Partial<PanelLayoutContentProps>>>;

const PanelLayoutContent = ({
  longPanelContent,
  longMainContent,
  buttons,
  minContentSize,
  minPanelSize,
  maxPanelSize,
  display,
  panelPosition,
}: PanelLayoutContentProps) => {
  const [size, setSize] = useState(Math.max(200, minPanelSize));
  const [actualMaxPanelSize, setActualMaxPanelSize] = useState(size);

  const actualSize = Math.min(size, actualMaxPanelSize);
  const collapsed = actualMaxPanelSize < minPanelSize;

  return (
    <PanelLayout
      panelSize={actualSize}
      minPanelSize={minPanelSize}
      maxPanelSize={actualMaxPanelSize}
      resizable={true}
      onPanelResize={({ detail }) => setSize(detail.panelSize)}
      onLayoutChange={({ detail }) => setActualMaxPanelSize(Math.min(detail.totalSize - minContentSize, maxPanelSize))}
      display={display === 'all' && collapsed ? 'main-only' : display}
      panelPosition={panelPosition}
      mainFocusable={longMainContent && !buttons ? { ariaLabel: 'Main content' } : undefined}
      panelFocusable={longPanelContent && !buttons ? { ariaLabel: 'Panel content' } : undefined}
      panelContent={
        <Box padding="m">
          <Header>Panel content</Header>
          {new Array(longPanelContent ? 20 : 1)
            .fill('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
            .map((t, i) => (
              <div key={i}>{t}</div>
            ))}
          {buttons && <Button>Button</Button>}
        </Box>
      }
      mainContent={
        <Box padding="m">
          <Header>Main content{collapsed && ' [collapsed]'}</Header>
          {new Array(longMainContent ? 200 : 1)
            .fill('Lorem ipsum dolor sit amet, consectetur adipiscing elit.')
            .map((t, i) => (
              <div key={i}>{t}</div>
            ))}
          {buttons && <Button>button</Button>}
        </Box>
      }
    />
  );
};

export default function PanelLayoutPage() {
  const {
    urlParams: {
      longPanelContent = false,
      longMainContent = false,
      buttons = true,
      minPanelSize = 200,
      maxPanelSize = 600,
      minContentSize = 600,
      display = 'all',
      panelPosition = 'side-start',
    },
    setUrlParams,
  } = useContext(AppContext as PageContext);

  return (
    <I18nProvider messages={[messages]} locale="en">
      <ScreenshotArea disableAnimations={true} gutters={false}>
        <AppLayout
          ariaLabels={labels}
          navigation={
            <Drawer header="Settings">
              <SpaceBetween direction="vertical" size="m">
                <Checkbox
                  checked={longMainContent}
                  onChange={({ detail }) => setUrlParams({ longMainContent: detail.checked })}
                >
                  Long main content
                </Checkbox>
                <Checkbox
                  checked={longPanelContent}
                  onChange={({ detail }) => setUrlParams({ longPanelContent: detail.checked })}
                >
                  Long panel content
                </Checkbox>
                <Checkbox checked={buttons} onChange={({ detail }) => setUrlParams({ buttons: detail.checked })}>
                  Include interactive content
                </Checkbox>
                <FormField label="Minimum panel size">
                  <Input
                    type="number"
                    value={minPanelSize.toString()}
                    onChange={({ detail }) => setUrlParams({ minPanelSize: detail.value ? parseInt(detail.value) : 0 })}
                  />
                </FormField>
                <FormField label="Maximum panel size">
                  <Input
                    type="number"
                    value={maxPanelSize.toString()}
                    onChange={({ detail }) =>
                      setUrlParams({ maxPanelSize: detail.value ? parseInt(detail.value) : Number.MAX_SAFE_INTEGER })
                    }
                  />
                </FormField>
                <FormField label="Minimum content size">
                  <Input
                    type="number"
                    value={minContentSize.toString()}
                    onChange={({ detail }) =>
                      setUrlParams({ minContentSize: detail.value ? parseInt(detail.value) : 0 })
                    }
                  />
                </FormField>
                <FormField label="Panel position">
                  <SegmentedControl
                    options={[
                      { id: 'side-start', text: 'side-start' },
                      { id: 'side-end', text: 'side-end' },
                    ]}
                    selectedId={panelPosition}
                    onChange={({ detail }) => setUrlParams({ panelPosition: detail.selectedId as any })}
                  />
                </FormField>
                <FormField label="Display">
                  <SegmentedControl
                    options={[
                      { id: 'all', text: 'all' },
                      { id: 'panel-only', text: 'panel-only' },
                      { id: 'main-only', text: 'main-only' },
                    ]}
                    selectedId={display}
                    onChange={({ detail }) => setUrlParams({ display: detail.selectedId as any })}
                  />
                </FormField>
              </SpaceBetween>
            </Drawer>
          }
          content={<Header variant="h1">Panel layout in drawer demo</Header>}
          drawers={[
            {
              id: 'panel',
              content: (
                <PanelLayoutContent
                  longMainContent={longMainContent}
                  longPanelContent={longPanelContent}
                  buttons={buttons}
                  minPanelSize={minPanelSize}
                  maxPanelSize={maxPanelSize}
                  minContentSize={minContentSize}
                  display={display}
                  panelPosition={panelPosition}
                />
              ),
              resizable: true,
              defaultSize: 1000,
              ariaLabels: {
                drawerName: 'Panel',
                triggerButton: 'Open panel',
                closeButton: 'Close panel',
                resizeHandle: 'Resize drawer',
              },
              trigger: { iconName: 'contact' },
            },
          ]}
        />
      </ScreenshotArea>
    </I18nProvider>
  );
}
