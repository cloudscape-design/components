// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';
import { capitalize, range } from 'lodash';

import { Box, Checkbox, SpaceBetween } from '~components';
import Drawer, { DrawerProps } from '~components/drawer';

import AppContext, { AppContextType } from '../app/app-context';
import { SimplePage } from '../app/templates';

const accentColor = '#6237a7';
const bottomDrawerContentHeight = 200;
const drawerHeaderHeight = 64;
const sideDrawerBottomOffset = bottomDrawerContentHeight + drawerHeaderHeight;

type PageContext = React.Context<
  AppContextType<{
    backdrops?: string;
    tallContent?: boolean;
  }>
>;

export default function () {
  const {
    urlParams: { backdrops: backdropsStr = 'top', tallContent = false },
    setUrlParams,
  } = useContext(AppContext as PageContext);
  const backdrops = backdropsStr.split(',').map(id => id.trim());
  const hasBackdrop = (id: string) => backdrops.includes(id);
  return (
    <SimplePage
      title="Drawer position: absolute"
      subtitle="This page demonstrates drawers with absolute position."
      i18n={{}}
      screenshotArea={{}}
      settings={
        <SpaceBetween size="xs" direction="horizontal">
          {['top', 'start', 'end', 'bottom-1', 'bottom-2'].map(id => (
            <Checkbox
              key={id}
              checked={hasBackdrop(id)}
              onChange={({ detail }) => {
                const next = detail.checked ? [...backdrops, id] : backdrops.filter(b => b !== id);
                setUrlParams({ backdrops: next.join(',') });
              }}
            >
              Show {id} backdrop
            </Checkbox>
          ))}
          <Checkbox checked={tallContent} onChange={({ detail }) => setUrlParams({ tallContent: detail.checked })}>
            Tall content
          </Checkbox>
        </SpaceBetween>
      }
    >
      <div style={{ border: `1px solid ${accentColor}`, position: 'relative' }}>
        <div style={{ flex: 1, padding: 16 }}>
          {range(0, 50).map(i => (
            <div key={i}>Line {i + 1}</div>
          ))}
        </div>
        <AbsoluteDrawer
          header="Top"
          placement="top"
          offset={{ start: 200, end: 200 }}
          zIndex={1}
          contentHeight={200}
          backdrop={hasBackdrop('top')}
          tallContent={tallContent}
        />
        <AbsoluteDrawer
          header="Start"
          placement="start"
          offset={{ bottom: sideDrawerBottomOffset }}
          zIndex={2}
          contentWidth={200}
          backdrop={hasBackdrop('start')}
          tallContent={tallContent}
        />
        <AbsoluteDrawer
          header="End"
          placement="end"
          offset={{ bottom: sideDrawerBottomOffset }}
          zIndex={3}
          contentWidth={200}
          backdrop={hasBackdrop('end')}
          tallContent={tallContent}
        />
        <AbsoluteDrawer
          header="Bottom 1"
          placement="bottom"
          offset={{}}
          zIndex={4}
          contentHeight={bottomDrawerContentHeight}
          backdrop={hasBackdrop('bottom-1')}
          tallContent={tallContent}
        />
        <AbsoluteDrawer
          header="Bottom 2"
          placement="bottom"
          offset={{}}
          zIndex={5}
          contentHeight={140}
          backdrop={hasBackdrop('bottom-2')}
          tallContent={tallContent}
        />
      </div>
    </SimplePage>
  );
}

function AbsoluteDrawer({
  header,
  placement,
  offset,
  zIndex,
  contentWidth,
  contentHeight,
  backdrop,
  tallContent,
}: DrawerProps & { contentWidth?: number; contentHeight?: number; tallContent: boolean }) {
  const sizeStr = contentHeight ? `height=${contentHeight}px` : `width=${contentWidth}px`;
  const formatOffset = (offset?: DrawerProps.Offset) => JSON.stringify(offset, null, 2).replace(/"/g, '');
  return (
    <Drawer
      header={header}
      position="absolute"
      placement={placement}
      disableContentPaddings={true}
      offset={offset}
      zIndex={zIndex}
      backdrop={backdrop}
    >
      <div
        style={{
          boxSizing: 'border-box',
          padding: 16,
          width: contentWidth,
          height: contentHeight,
        }}
      >
        {capitalize(placement)} drawer with content {tallContent ? 'tall' : sizeStr}, {`offset=${formatOffset(offset)}`}
        , and zIndex={zIndex}
        {tallContent && range(0, 60).map(i => <Box key={i}>Content line {i + 1}</Box>)}
      </div>
    </Drawer>
  );
}
